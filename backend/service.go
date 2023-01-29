package backend

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	vgjob "code.vegaprotocol.io/vega/libs/job"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const (
	// UnknownStatus is used when the service health check is not yet known.
	UnknownStatus HealthCheckStatus = "unknown_status"

	// ServiceIsHealthy is sent when the service is healthy.
	// This event can be emitted every 15 seconds.
	ServiceIsHealthy HealthCheckStatus = "service_is_healthy"

	// ServiceIsUnhealthy is sent when the service is unhealthy, meaning we could
	// connect but the endpoint didn't answer what we expected.
	// This event can be emitted every 15 seconds.
	ServiceIsUnhealthy HealthCheckStatus = "service_is_unhealthy"

	// ServiceUnreachable is sent when no service is not running anymore.
	// This event can be emitted every 15 seconds.
	ServiceUnreachable HealthCheckStatus = "service_unreachable"

	// ServiceStopped is sent when the service has been stopped by the user.
	// This event is emitted once per service lifecycle.
	// If emitted, the `ServiceStoppedWithError` is not be emitted.
	ServiceStopped = "service_stopped"

	// ServiceStoppedWithError is sent when the service unexpectedly stopped,
	// like an internal crash, of a fail to bind the port.
	// This event is emitted once per service lifecycle.
	// If emitted, the `ServiceStopped` is not be emitted.
	ServiceStoppedWithError = "service_stopped_with_error"

	// serviceHealthMonitoringDelayedStart is the delay before the monitoring
	// start.
	serviceHealthMonitoringDelayedStart = 5 * time.Second

	// serviceHealthMonitoringInterval is the interval between each health
	// monitoring verification.
	serviceHealthMonitoringInterval = 15 * time.Second
)

var (
	ErrContextCanceled       = errors.New("context canceled")
	ErrServiceAlreadyRunning = errors.New("the service is already running")
	ErrServiceNotRunning     = errors.New("the service is not running")
)

type HealthCheckStatus string

type StartServiceRequest struct {
	Network        string `json:"network"`
	NoVersionCheck bool   `json:"noVersionCheck"`
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("the network is required")
	}

	return nil
}

func (h *Handler) StartService(req *StartServiceRequest) (err error) {
	if err := h.ensureBackendStarted(); err != nil {
		return err
	}

	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if err := h.ensureAppIsInitialised(); err != nil {
		return err
	}

	if h.runningServiceManager.IsServiceRunning() {
		h.log.Error("The service is already running")
		return ErrServiceAlreadyRunning
	}

	h.runningServiceManager.SetAsRunning()

	defer func() {
		if err != nil {
			h.runningServiceManager.ShutdownService()
			h.log.Info("The service state has been reset")
		}
	}()

	if err := req.Check(); err != nil {
		h.log.Debug("invalid start service request", zap.Error(err))
		return err
	}

	jobRunner := vgjob.NewRunner(context.Background())
	h.runningServiceManager.OnShutdown(jobRunner.StopAllJobs)

	svcURL, errChan, err := h.serviceStarter.Start(jobRunner, req.Network, true)
	if err != nil {
		h.log.Error("Failed to start HTTP server", zap.Error(err))
		return err
	}
	h.runningServiceManager.SetURL(svcURL)

	h.log.Info("Starting HTTP service", zap.String("url", svcURL))

	jobRunner.Go(func(jobCtx context.Context) {
		h.listenToServiceRuntimeError(jobCtx, errChan)
	})

	jobRunner.Go(func(jobCtx context.Context) {
		h.listenToIncomingInteractions(jobCtx)
	})

	// We warn the front-end by sending events when the service is unhealthy.
	// This is done so the front-end doesn't have to do it.
	jobRunner.Go(func(jobCtx context.Context) {
		h.monitorServiceHealth(jobCtx, svcURL)
	})

	return nil
}

func (h *Handler) StopService() error {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.runningServiceManager.IsServiceRunning() {
		h.log.Error("No service running")
		return ErrServiceNotRunning
	}

	h.log.Info("Stopping the service")
	h.runningServiceManager.ShutdownService()
	h.log.Info("Service stopped")
	runtime.EventsEmit(h.ctx, ServiceStopped)

	return nil
}

type GetCurrentServiceInfo struct {
	URL               string `json:"url"`
	LogFilePath       string `json:"logFilePath"`
	IsRunning         bool   `json:"isRunning"`
	LatestHealthState string `json:"latestHealthState"`
}

func (h *Handler) GetCurrentServiceInfo() (GetCurrentServiceInfo, error) {
	if err := h.ensureBackendStarted(); err != nil {
		return GetCurrentServiceInfo{}, err
	}

	h.log.Debug("Entering GetCurrentServiceInfo")
	defer h.log.Debug("Leaving GetCurrentServiceInfo")

	if err := h.ensureAppIsInitialised(); err != nil {
		return GetCurrentServiceInfo{}, err
	}

	if !h.runningServiceManager.IsServiceRunning() {
		return GetCurrentServiceInfo{
			IsRunning: false,
		}, nil
	}

	return GetCurrentServiceInfo{
		URL:               h.runningServiceManager.url,
		LogFilePath:       h.runningServiceManager.logFilePath,
		IsRunning:         true,
		LatestHealthState: string(h.runningServiceManager.latestHealthState),
	}, nil
}

func (h *Handler) listenToIncomingInteractions(ctx context.Context) {
	log := h.log.Named("service-interactions-listener")
	log.Info("Listening to incoming interactions")
	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the listening to incoming interactions")
			return
		case interaction, ok := <-h.runningServiceManager.receptionChan:
			if !ok {
				return
			}
			h.emitReceivedInteraction(log, interaction)
		}
	}
}

func (h *Handler) listenToServiceRuntimeError(jobCtx context.Context, errChan <-chan error) {
	log := h.log.Named("service-runtime-error-listener")
	log.Info("Listening to service runtime error")

	for {
		select {
		case <-jobCtx.Done():
			log.Info("Stopping the listening to the service runtime error")
			return
		case err, ok := <-errChan:
			if !ok {
				return
			}
			h.log.Error("An error occurred while running the service", zap.Error(err))
			h.runningServiceManager.ShutdownService()
			runtime.EventsEmit(h.ctx, ServiceStoppedWithError, struct {
				Error error
			}{
				Error: err,
			})
		}
	}
}

func (h *Handler) monitorServiceHealth(ctx context.Context, svcURL string) {
	// We wait a little before starting the monitoring, so the service has
	// time to start, and we avoid to emit erroneous events.
	time.Sleep(serviceHealthMonitoringDelayedStart)

	log := h.log.Named("service-health-monitoring")

	log.Info("Starting the service health monitoring",
		zap.String("host", svcURL),
		zap.Duration("interval", serviceHealthMonitoringInterval),
	)

	// We query the service health once before moving to the ticker, otherwise
	// we have to wait for delayedStart + monitoringInterval.
	h.queryServiceHealth(log, svcURL)

	ticker := time.NewTicker(serviceHealthMonitoringInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the service health monitoring")
			return
		case <-ticker.C:
			h.queryServiceHealth(log, svcURL)
		}
	}
}

func (h *Handler) queryServiceHealth(log *zap.Logger, svcURL string) {
	url := "http://" + svcURL + "/api/v2/health"
	log.Debug("Checking the service health", zap.String("url", url))
	response, err := http.Get(url)
	if err != nil {
		log.Error("Could not reach the service", zap.Error(err))
		h.runningServiceManager.SetHealth(ServiceUnreachable)
	} else if response != nil && response.StatusCode == http.StatusOK {
		log.Debug("The service is healthy")
		h.runningServiceManager.SetHealth(ServiceIsHealthy)
	} else {
		log.Warn("The service is reachable but is not healthy", zap.String("code", response.Status))
		h.runningServiceManager.SetHealth(ServiceIsUnhealthy)
	}
	runtime.EventsEmit(h.ctx, string(h.runningServiceManager.ServiceHealth()))
}

func buildServiceLogger(vegaPaths paths.Paths, logDir paths.StatePath, logLevel string) (*zap.Logger, string, zap.AtomicLevel, error) {
	loggerConfig := vgzap.DefaultConfig()
	loggerConfig = vgzap.WithFileOutputForDedicatedProcess(loggerConfig, vegaPaths.StatePathFor(logDir))
	logFilePath := loggerConfig.OutputPaths[0]
	loggerConfig = vgzap.WithJSONFormat(loggerConfig)
	loggerConfig = vgzap.WithLevel(loggerConfig, logLevel)

	level := loggerConfig.Level

	logger, err := vgzap.Build(loggerConfig)
	if err != nil {
		return nil, "", zap.AtomicLevel{}, fmt.Errorf("could not setup the logger: %w", err)
	}

	return logger, logFilePath, level, nil
}
