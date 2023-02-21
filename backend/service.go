package backend

import (
	"errors"
	"time"

	"code.vegaprotocol.io/vega/wallet/service"
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

	if err := req.Check(); err != nil {
		h.log.Debug("Invalid start service request", zap.Error(err))
		return err
	}

	if err := h.serviceStarter.StartService(h.ctx, req.Network); err != nil {
		h.log.Error("Could not start the service", zap.Error(err))
		return err
	}

	return nil
}

func (h *Handler) StopService() {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.serviceStarter.IsServiceRunning() {
		h.log.Info("No service running")
		return
	}

	h.log.Info("Stopping the service")
	h.serviceStarter.StopService()
	h.log.Info("Service stopped")
	runtime.EventsEmit(h.ctx, ServiceStopped)
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

	return h.serviceStarter.Info(), nil
}

func (h *Handler) GetServiceConfig() (*service.Config, error) {
	if err := h.ensureBackendStarted(); err != nil {
		return nil, err
	}

	h.log.Debug("Entering GetServiceConfig")
	defer h.log.Debug("Leaving GetServiceConfig")

	if err := h.ensureAppIsInitialised(); err != nil {
		return nil, err
	}

	config, err := h.svcStore.GetConfig()
	if err != nil {
		h.log.Error("Couldn't retrieve the service configuration", zap.Error(err))
		return nil, err
	}

	return config, nil
}

func (h *Handler) UpdateServiceConfig(cfg service.Config) error {
	if err := h.ensureBackendStarted(); err != nil {
		return err
	}

	h.log.Debug("Entering GetServiceConfig")
	defer h.log.Debug("Leaving GetServiceConfig")

	if err := h.ensureAppIsInitialised(); err != nil {
		return err
	}

	if err := h.svcStore.SaveConfig(&cfg); err != nil {
		h.log.Error("Couldn't save the service configuration", zap.Error(err))
		return err
	}

	return nil
}
