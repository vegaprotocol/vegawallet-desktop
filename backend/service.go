package backend

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"code.vegaprotocol.io/vega/paths"
	"code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	"code.vegaprotocol.io/vega/wallet/network"
	netstore "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/node"
	"code.vegaprotocol.io/vega/wallet/service"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"code.vegaprotocol.io/vegawallet-desktop/logger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const (
	// ServiceIsHealthy is sent when the service is healthy.
	// This event can be emitted every 15 seconds.
	ServiceIsHealthy = "service_is_healthy"

	// ServiceIsUnhealthy is sent when the service is unhealthy, meaning we could
	// connect but the endpoint didn't answer what we expected.
	// This event can be emitted every 15 seconds.
	ServiceIsUnhealthy = "service_is_unhealthy"

	// ServiceUnreachable is sent when no service is not running anymore.
	// This event can be emitted every 15 seconds.
	ServiceUnreachable = "service_unreachable"

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

type StartServiceRequest struct {
	Network string `json:"network"`
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("network is required")
	}

	return nil
}

func (h *Handler) StartService(req *StartServiceRequest) error {
	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if h.service.IsRunning() {
		h.log.Error("The service is already running")
		return ErrServiceAlreadyRunning
	}

	if err := req.Check(); err != nil {
		return err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return err
	}

	handler := wallets.NewHandler(wStore)

	netStore, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise network store: %v", err))
		return fmt.Errorf("couldn't initialise network store: %w", err)
	}

	exists, err := netStore.NetworkExists(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not verify the network existence: %v", err))
		return fmt.Errorf("couldn't verify the network existence: %w", err)
	}
	if !exists {
		h.log.Error(fmt.Sprintf("Network %s does not exist", req.Network))
		return network.NewDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise network store: %v", err))
		return fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.LogLevel.String()
	log, err := logger.New(logLevel, h.configLoader.LogFilePathForSvc())
	if err != nil {
		return err
	}
	log = log.Named("service")
	defer logger.Sync(log)

	svcStore, err := h.getServiceStore(config)
	if err != nil {
		return err
	}

	isInit, err := service.IsInitialised(svcStore)
	if err != nil {
		return fmt.Errorf("couldn't verify service initialisation state: %w", err)
	}

	if !isInit {
		if err = service.InitialiseService(svcStore, false); err != nil {
			return fmt.Errorf("couldn't initialise the service: %w", err)
		}
	}

	auth, err := service.NewAuth(log.Named("auth"), svcStore, cfg.TokenExpiry.Get())
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise authentication: %v", err))
		return fmt.Errorf("couldn't initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), cfg.API.GRPC)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise the node forwarder: %v", err))
		return fmt.Errorf("couldn't initialise the node forwarder: %w", err)
	}

	ctx, cancelFn := context.WithCancel(context.Background())
	loggingCancelFn := func() {
		log.Info("Cancel function triggered")
		cancelFn()
		logger.Sync(log)
	}

	jsonRpcLogger := log.Named("json-rpc")

	nodeSelector, err := nodeapi.BuildRoundRobinSelectorWithRetryingNodes(jsonRpcLogger, cfg.API.GRPC.Hosts, cfg.API.GRPC.Retries)
	if err != nil {
		h.log.Error("Could not initialise the node selector", zap.Error(err))
		loggingCancelFn()
		return fmt.Errorf("could not initialise the node selector: %w", err)
	}

	sequentialInteractor := interactor.NewSequentialInteractor(ctx, h.service.ReceptionChan, h.service.ResponseChan)

	clientAPI, err := api.ClientAPI(jsonRpcLogger, wStore, sequentialInteractor, nodeSelector)
	if err != nil {
		h.log.Error("Could not initialise the JSON-RPC API", zap.Error(err))
		loggingCancelFn()
		return err
	}

	svcURL := fmt.Sprintf("%s:%v", cfg.Host, cfg.Port)

	// Check if something is already served. If not, we proceed.
	// It's not fool-proof, but it should catch 99% of the problems.
	if err := h.ensurePortCanBeBound(svcURL); err != nil {
		return err
	}

	// Past this point, we assume we can bind the service.

	srv, err := service.NewService(log.Named("service"), cfg, clientAPI, handler, auth, forwarder, UnsupportedV1APIPolicy{})
	if err != nil {
		h.log.Error("Could not initialise the service", zap.Error(err))
		loggingCancelFn()
		return err
	}

	h.service.Set(svcURL, func() {
		loggingCancelFn()
		if err := srv.Stop(); err != nil {
			h.log.Error("Could not properly stop the service", zap.Error(err))
		}
	})

	go func() {
		h.listenToIncomingInteractions(ctx)
	}()

	go func() {
		h.startService(srv, loggingCancelFn)
	}()

	// We warn the front-end by sending events when the service is unhealthy.
	// This is done so the front-end doesn't have to do it.
	go func() {
		h.monitorServiceHealth(ctx, svcURL)
	}()

	return nil
}

func (h *Handler) StopService() error {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.service.IsRunning() {
		h.log.Error("No service running")
		return ErrServiceNotRunning
	}

	h.log.Info("Stopping the service")
	h.service.Shutdown()
	h.service.Reset()
	h.log.Info("Service stopped")
	runtime.EventsEmit(h.ctx, ServiceStopped)

	return nil
}

type GetServiceStateResponse struct {
	URL     string `json:"url"`
	Running bool   `json:"running"`
}

func (h *Handler) GetServiceState() GetServiceStateResponse {
	h.log.Debug("Entering GetServiceState")
	defer h.log.Debug("Leaving GetServiceState")

	return GetServiceStateResponse{
		URL:     h.service.URL(),
		Running: h.service.IsRunning(),
	}
}

func (h *Handler) ensurePortCanBeBound(svcURL string) error {
	if _, err := http.Get("http://" + svcURL); err == nil {
		// If there is no error, it means the server managed to establish a
		// connection of some kind. It's not good for us.
		return fmt.Errorf("could not start the service as an application is already served on %q", svcURL)
	}
	return nil
}

func (h *Handler) listenToIncomingInteractions(ctx context.Context) {
	log := h.log.Named("service-interactions-listener")
	log.Info("Starting to listen to incoming interactions")
	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the listening to incoming interactions")
			return
		case interaction := <-h.service.ReceptionChan:
			h.emitReceivedInteraction(log, interaction)
		}
	}
}

func (h *Handler) startService(srv *service.Service, cancelFn context.CancelFunc) {
	log := h.log.Named("service-starter")
	log.Info("Starting the service")
	if err := srv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Error(fmt.Sprintf("Error while running HTTP server: %v", err))
		cancelFn()
		h.service.Shutdown()
		h.service.Reset()
		log.Debug("Service state has been reset")
		runtime.EventsEmit(h.ctx, ServiceStoppedWithError, struct {
			Error error
		}{
			Error: err,
		})
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
	h.queryServiceHeath(log, svcURL)

	ticker := time.NewTicker(serviceHealthMonitoringInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the service health monitoring")
			return
		case <-ticker.C:
			h.queryServiceHeath(log, svcURL)
		}
	}
}

func (h *Handler) queryServiceHeath(log *zap.Logger, svcURL string) {
	url := "http://" + svcURL + "/api/v2/methods"
	log.Debug("Checking the service health", zap.String("url", url))
	response, err := http.Get(url)
	if err != nil {
		log.Error("Could not reach the service", zap.Error(err))
		runtime.EventsEmit(h.ctx, ServiceUnreachable)
	} else if response != nil && response.StatusCode == http.StatusOK {
		log.Debug("The service is healthy")
		runtime.EventsEmit(h.ctx, ServiceIsHealthy)
	} else {
		runtime.EventsEmit(h.ctx, ServiceIsUnhealthy)
		log.Warn("The service is reachable but is not healthy", zap.String("code", response.Status))
	}
}
