package backend

import (
	"context"
	"fmt"

	"code.vegaprotocol.io/vega/libs/jsonrpc"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	sessionstore "code.vegaprotocol.io/vega/wallet/api/session/store/v1"
	netstore "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/service"
	svcstore "code.vegaprotocol.io/vega/wallet/service/store/v1"
	wstore "code.vegaprotocol.io/vega/wallet/wallet/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Handler struct {
	// This context needs to be kept, as advised by Wails documentation, as it's
	// the one to inject on runtime methods like menu, event, dialogs, etc.
	ctx context.Context

	// appInitialised represents the initialization state of the application
	// and is used to prevent calls to the API when the application is not
	// initialised.
	appInitialised bool

	log *zap.Logger
	// logLevel is a reference to the logger's log level to dynamically change
	// it when the configuration is updated.
	logLevel zap.AtomicLevel

	configLoader *app.ConfigLoader

	walletAPI *jsonrpc.API

	currentService        *serviceInfo
	serviceShutdownSwitch *walletapi.ServiceShutdownSwitch
}

func NewHandler() (*Handler, error) {
	h := &Handler{}

	var err error

	if err := h.initializeAppLogger(); err != nil {
		return nil, err
	}

	h.configLoader, err = app.NewConfigLoader()
	if err != nil {
		return nil, fmt.Errorf("could not create the configuration loader: %w", err)
	}

	h.currentService = newServiceInfo()

	h.appInitialised, err = h.isAppInitialised()
	if err != nil {
		return nil, fmt.Errorf("could not verify wheter the application is initialized or not: %w", err)
	}

	// If the application is not initialized, it means it's the first time the
	// user is running the application. As a result, we can't load the backend
	// components that require an existing configuration. The user will have
	// to go through the application initialization process, that is part of
	// the "on-boarding" workflow on the front-end.
	if h.appInitialised {
		if err := h.reloadBackendComponentsFromConfig(); err != nil {
			return nil, fmt.Errorf("could not load the backend components during the application start up: %w", err)
		}
	}

	return h, nil
}

// Startup is called during application startup
func (h *Handler) Startup(ctx context.Context) {
	h.ctx = ctx

	h.log.Debug("Entering Startup")
	defer h.log.Debug("Leaving Startup")
}

// DOMReady is called after the front-end dom has been loaded
func (h *Handler) DOMReady(_ context.Context) {
	// Add your action here
}

// Shutdown is called during application termination
func (h *Handler) Shutdown(_ context.Context) {
	h.log.Debug("Entering Shutdown")
	defer h.log.Debug("Leaving Shutdown")

	_ = h.StopService()
	h.serviceShutdownSwitch.Flip(nil)
}

func (h *Handler) initializeAppLogger() error {
	appLogsDir, err := paths.CreateDefaultStateDirFor(paths.WalletAppLogsHome)
	if err != nil {
		return fmt.Errorf("could not create configuration file at %s: %w", paths.WalletAppDefaultConfigFile, err)
	}

	loggerConfig := vgzap.DefaultConfig()
	loggerConfig = vgzap.WithFileOutputForDedicatedProcess(loggerConfig, appLogsDir)
	loggerConfig = vgzap.WithJSONFormat(loggerConfig)
	loggerConfig = vgzap.WithLevel(loggerConfig, zap.InfoLevel.String())

	// We need to keep the logger level to dynamically change it.
	h.logLevel = loggerConfig.Level

	log, err := vgzap.Build(loggerConfig)
	if err != nil {
		return fmt.Errorf("could not setup the application logger: %w", err)
	}

	h.log = log.Named("backend")

	return nil
}

func (h *Handler) reloadBackendComponentsFromConfig() error {
	if h.currentService.IsRunning() {
		h.currentService.Shutdown()
	}

	cfg, err := h.configLoader.GetConfig()
	if err != nil {
		return fmt.Errorf("could not load the application configuration: %w", err)
	}

	if err := h.updateAppLogLevel(cfg.LogLevel); err != nil {
		return err
	}

	if err := h.initializeWalletAPI(cfg); err != nil {
		return err
	}

	return nil
}

func (h *Handler) updateBackendComponentsFromConfig() error {
	cfg, err := h.configLoader.GetConfig()
	if err != nil {
		return fmt.Errorf("could not load the application configuration: %w", err)
	}

	if cfg.LogLevel != h.logLevel.String() {
		if err := h.updateAppLogLevel(cfg.LogLevel); err != nil {
			return err
		}
	}

	return nil
}

func (h *Handler) initializeWalletAPI(cfg app.Config) error {
	vegaPaths := paths.New(cfg.VegaHome)

	netStore, err := h.getNetworksStore(vegaPaths)
	if err != nil {
		return err
	}

	walletStore, err := h.getWalletsStore(vegaPaths)
	if err != nil {
		return err
	}

	svcStore, err := svcstore.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service store: %v", err))
		return fmt.Errorf("could not initialise the service store: %w", err)
	}

	policyBuilderFunc := func(_ context.Context) service.Policy {
		return &unsupportedV1APIPolicy{
			log: h.log.Named("api-v1-policy"),
		}
	}

	interactorBuilderFunc := func(ctx context.Context) walletapi.Interactor {
		return interactor.NewSequentialInteractor(ctx, h.currentService.receptionChan, h.currentService.responseChan)
	}

	nodeSelectorBuilder := func(hosts []string, retries uint64) (nodeapi.Selector, error) {
		nodeSelector, err := nodeapi.BuildRoundRobinSelectorWithRetryingNodes(h.log, hosts, retries)
		if err != nil {
			h.log.Error(fmt.Sprintf("Could not initialise the node selector for wallet API: %v", err))
			return nil, fmt.Errorf("could not initialise the node selector for wallet API: %w", err)
		}
		return nodeSelector, nil
	}

	shutdownSwitchBuilder := func() *walletapi.ServiceShutdownSwitch {
		h.serviceShutdownSwitch = walletapi.NewServiceShutdownSwitch(func(err error) {
			h.log.Error("HTTP server encountered an error", zap.Error(err))
		})
		return h.serviceShutdownSwitch
	}

	loggerBuilderFunc := func(path paths.StatePath, levelName string) (*zap.Logger, zap.AtomicLevel, error) {
		return h.log, h.logLevel, nil
	}

	walletAPI, err := walletapi.AdminAPI(h.log.Named("json-api"),
		walletStore,
		netStore,
		svcStore,
		sessionstore.NewEmptyStore(),
		nodeSelectorBuilder,
		policyBuilderFunc,
		interactorBuilderFunc,
		loggerBuilderFunc,
		shutdownSwitchBuilder,
	)
	if err != nil {
		h.log.Error("Could not initialize the wallet administration API", zap.Error(err))
		return fmt.Errorf("could not initialize the wallet administration API: %w", err)
	}

	h.walletAPI = walletAPI

	return nil
}

func (h *Handler) updateAppLogLevel(level string) error {
	resolvedLevel, err := zapcore.ParseLevel(level)
	if err != nil {
		return fmt.Errorf("invalid log level: %w", err)
	}
	h.logLevel.SetLevel(resolvedLevel)
	return nil
}

func (h *Handler) getNetworksStore(vegaPaths paths.Paths) (*netstore.Store, error) {
	st, err := netstore.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the networks store: %v", err))
		return nil, fmt.Errorf("could not initialise the networks store: %w", err)
	}

	return st, nil
}

func (h *Handler) getWalletsStore(vegaPaths paths.Paths) (*wstore.Store, error) {
	store, err := wallets.InitialiseStoreFromPaths(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the wallets store: %v", err))
		return nil, fmt.Errorf("could not initialise the wallets store: %w", err)
	}
	return store, nil
}

func (h *Handler) appConfig() (app.Config, error) {
	c, err := h.configLoader.GetConfig()
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't load the application configuration: %v", err))
		return app.Config{}, fmt.Errorf("could not load the application configuration: %w", err)
	}

	return c, nil
}
