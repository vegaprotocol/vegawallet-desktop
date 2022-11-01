package backend

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	"code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	"code.vegaprotocol.io/vega/wallet/network"
	netstore "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/node"
	"code.vegaprotocol.io/vega/wallet/service"
	svcstore "code.vegaprotocol.io/vega/wallet/service/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const (
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
	Network string `json:"network"`
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("the network is required")
	}

	return nil
}

func (h *Handler) StartService(req *StartServiceRequest) error {
	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if err := h.ensureAppIsInitialised(); err != nil {
		return err
	}

	if h.currentService.IsRunning() {
		h.log.Error("The service is already running")
		return ErrServiceAlreadyRunning
	}

	if err := req.Check(); err != nil {
		h.log.Debug("invalid start service request", zap.Error(err))
		return err
	}

	config, err := h.appConfig()
	if err != nil {
		return err
	}

	walletStore, err := h.getWalletsStore(config)
	if err != nil {
		return err
	}

	handler := wallets.NewHandler(walletStore)

	vegaPath := paths.New(config.VegaHome)

	netStore, err := netstore.InitialiseStore(vegaPath)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise network store: %v", err))
		return fmt.Errorf("could not initialise network store: %w", err)
	}

	exists, err := netStore.NetworkExists(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not verify the network existence: %v", err))
		return fmt.Errorf("could not verify the network existence: %w", err)
	}
	if !exists {
		h.log.Error(fmt.Sprintf("Network %s does not exist", req.Network))
		return network.NewDoesNotExistError(req.Network)
	}

	netCfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise network store: %v", err))
		return fmt.Errorf("could not initialise network store: %w", err)
	}

	log, logFilePath, err := buildServiceLogger(vegaPath, netCfg.LogLevel.String())
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not build the service logger: %v", err))
		return err
	}
	defer vgzap.Sync(log)

	svcStore, err := svcstore.InitialiseStore(vegaPath)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service store: %v", err))
		return fmt.Errorf("could not initialise the service store: %w", err)
	}

	isInit, err := service.IsInitialised(svcStore)
	if err != nil {
		return fmt.Errorf("could not verify service initialisation state: %w", err)
	}

	if !isInit {
		if err = service.InitialiseService(svcStore, false); err != nil {
			return fmt.Errorf("could not initialise the service: %w", err)
		}
	}

	auth, err := service.NewAuth(log.Named("auth"), svcStore, netCfg.TokenExpiry.Get())
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise authentication: %v", err))
		return fmt.Errorf("could not initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), netCfg.API.GRPC)
	if err != nil {
		h.log.Error(fmt.Sprintf("Could not initialise the node forwarder: %v", err))
		return fmt.Errorf("could not initialise the node forwarder: %w", err)
	}

	ctx, cancelFn := context.WithCancel(context.Background())
	shutdownServiceFn := func() {
		log.Warn("Shutdown function triggered")
		cancelFn()
	}

	jsonRpcLogger := log.Named("json-rpc")

	nodeSelector, err := nodeapi.BuildRoundRobinSelectorWithRetryingNodes(jsonRpcLogger, netCfg.API.GRPC.Hosts, netCfg.API.GRPC.Retries)
	if err != nil {
		h.log.Error("Could not initialise the node selector", zap.Error(err))
		shutdownServiceFn()
		return fmt.Errorf("could not initialise the node selector: %w", err)
	}

	sequentialInteractor := interactor.NewSequentialInteractor(ctx, h.currentService.receptionChan, h.currentService.responseChan)

	clientAPI, err := api.ClientAPI(jsonRpcLogger, walletStore, sequentialInteractor, nodeSelector)
	if err != nil {
		h.log.Error("Could not initialise the JSON-RPC API", zap.Error(err))
		shutdownServiceFn()
		return err
	}

	svcURL := fmt.Sprintf("%s:%v", netCfg.Host, netCfg.Port)

	// Check if something is already served. If not, we proceed.
	// It's not fool-proof, but it should catch 99% of the problems.
	if err := h.ensurePortCanBeBound(svcURL); err != nil {
		return err
	}

	// Past this point, we assume we can bind the service, relatively, safely.

	unsupportedV1APIPolicy := &unsupportedV1APIPolicy{
		log: log.Named("api-v1-policy"),
	}

	srv, err := service.NewService(log.Named("http-server"), netCfg, clientAPI, handler, auth, forwarder, unsupportedV1APIPolicy)
	if err != nil {
		h.log.Error("Could not initialise the service", zap.Error(err))
		shutdownServiceFn()
		return err
	}

	h.currentService.SetInfo(svcURL, logFilePath)
	h.currentService.OnShutdown(func() {
		shutdownServiceFn()
		if err := srv.Stop(); err != nil {
			h.log.Error("Could not properly stop the service", zap.Error(err))
		}
	})

	go func() {
		h.listenToIncomingInteractions(ctx)
		vgzap.Sync(log)
	}()

	go func() {
		h.startService(srv, shutdownServiceFn)
		vgzap.Sync(log)
	}()

	// We warn the front-end by sending events when the service is unhealthy.
	// This is done so the front-end doesn't have to do it.
	go func() {
		h.monitorServiceHealth(ctx, svcURL)
		vgzap.Sync(log)
	}()

	return nil
}

func (h *Handler) StopService() error {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.currentService.IsRunning() {
		h.log.Error("No service running")
		return ErrServiceNotRunning
	}

	h.log.Info("Stopping the service")
	h.currentService.Shutdown()
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
	h.log.Debug("Entering GetCurrentServiceInfo")
	defer h.log.Debug("Leaving GetCurrentServiceInfo")

	if err := h.ensureAppIsInitialised(); err != nil {
		return GetCurrentServiceInfo{}, err
	}

	if !h.currentService.IsRunning() {
		return GetCurrentServiceInfo{
			IsRunning: false,
		}, nil
	}

	return GetCurrentServiceInfo{
		URL:               h.currentService.url,
		LogFilePath:       h.currentService.logFilePath,
		IsRunning:         true,
		LatestHealthState: string(h.currentService.latestHealthState),
	}, nil
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
		case interaction := <-h.currentService.receptionChan:
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
		h.currentService.Shutdown()
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
	url := "http://" + svcURL + "/api/v2/methods"
	log.Debug("Checking the service health", zap.String("url", url))
	response, err := http.Get(url)
	if err != nil {
		log.Error("Could not reach the service", zap.Error(err))
		h.currentService.SetHealth(ServiceUnreachable)
	} else if response != nil && response.StatusCode == http.StatusOK {
		log.Debug("The service is healthy")
		h.currentService.SetHealth(ServiceIsHealthy)
	} else {
		log.Warn("The service is reachable but is not healthy", zap.String("code", response.Status))
		h.currentService.SetHealth(ServiceIsUnhealthy)
	}
	runtime.EventsEmit(h.ctx, string(h.currentService.Health()))
}

func buildServiceLogger(vegaPath paths.Paths, level string) (*zap.Logger, string, error) {
	appLogsDir, err := vegaPath.CreateStateDirFor(paths.WalletAppLogsHome)
	if err != nil {
		return nil, "", fmt.Errorf("could not create configuration file at %s: %w", paths.WalletAppDefaultConfigFile, err)
	}

	loggerConfig := vgzap.DefaultConfig()
	loggerConfig = vgzap.WithFileOutputForDedicatedProcess(loggerConfig, appLogsDir)
	logFilePath := loggerConfig.OutputPaths[0]
	loggerConfig = vgzap.WithJSONFormat(loggerConfig)
	loggerConfig = vgzap.WithLevel(loggerConfig, level)

	log, err := vgzap.Build(loggerConfig)
	if err != nil {
		return nil, "", fmt.Errorf("could not setup the application logger: %w", err)
	}

	return log.Named("service"), logFilePath, nil
}
