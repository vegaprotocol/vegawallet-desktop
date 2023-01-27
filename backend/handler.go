package backend

import (
	"context"
	"fmt"

	vgclose "code.vegaprotocol.io/vega/libs/close"
	"code.vegaprotocol.io/vega/libs/jsonrpc"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	netStoreV1 "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/service"
	svcStoreV1 "code.vegaprotocol.io/vega/wallet/service/store/v1"
	serviceV1 "code.vegaprotocol.io/vega/wallet/service/v1"
	serviceV2 "code.vegaprotocol.io/vega/wallet/service/v2"
	"code.vegaprotocol.io/vega/wallet/service/v2/connections"
	tokenStoreV1 "code.vegaprotocol.io/vega/wallet/service/v2/connections/store/v1"
	walletStoreV1 "code.vegaprotocol.io/vega/wallet/wallet/store/v1"
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
	// initialized.
	appInitialised bool

	log *zap.Logger
	// logLevel is a reference to the logger's log level to dynamically change
	// it when the configuration is updated.
	logLevel zap.AtomicLevel

	configLoader *app.ConfigLoader

	// resourcesCloser holds resources that are shared by several component
	// which lifecycle is tied to the program.
	// This is called when the program get closed or fully reloaded (because
	// of a change of the home path).
	resourcesCloser *vgclose.Closer

	// serviceStarter is used to start the service, using predefined builders.
	serviceStarter *service.Starter

	// runningServiceManager manages the resource a running service. It gets valued
	// when the serviceStarter starts a service. It holds the resources whose lifecycles
	// are tied to the service.
	runningServiceManager *runningServiceManager

	// walletAdminAPI is the core backend of the wallet, that is shared by every
	// vega wallet implementation. Implementation specific features are exposed
	// as wails backend functions.
	walletAdminAPI *jsonrpc.Dispatcher

	networkStore       *netStoreV1.Store
	walletStore        *walletStoreV1.Store
	connectionsManager *connections.Manager
	tokenStore         *tokenStoreV1.EmptyStore
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

	h.runningServiceManager = newServiceManager()

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

	h.closeAllResources()
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

func (h *Handler) reloadBackendComponentsFromConfig() (err error) {
	h.closeAllResources()

	h.resourcesCloser = vgclose.NewCloser()

	// In case something goes wrong, we free up the resources.
	defer func() {
		if err != nil {
			h.closeAllResources()
		}
	}()

	cfg, err := h.configLoader.GetConfig()
	if err != nil {
		return fmt.Errorf("could not load the application configuration: %w", err)
	}

	if err := h.updateAppLogLevel(cfg.LogLevel); err != nil {
		return err
	}

	vegaPaths := paths.New(cfg.VegaHome)

	networkStore, err := netStoreV1.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the networks store: %v", err))
		return fmt.Errorf("could not initialise the networks store: %w", err)
	}
	h.networkStore = networkStore

	walletStore, err := wallets.InitialiseStoreFromPaths(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the wallets store: %v", err))
		return fmt.Errorf("could not initialise the wallets store: %w", err)
	}
	h.walletStore = walletStore

	tokenStore := tokenStoreV1.NewEmptyStore()
	h.tokenStore = tokenStore
	h.resourcesCloser.Add(tokenStore.Close)

	connectionsManager, err := connections.NewManager(serviceV2.NewStdTime(), walletStore, tokenStore)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the connections manager: %v", err))
		return fmt.Errorf("could not initialise the connections manager: %w", err)
	}
	h.connectionsManager = connectionsManager
	h.resourcesCloser.Add(connectionsManager.EndAllSessionConnections)

	h.initializeWalletAdminAPI()

	if err = h.initialiseServiceStarter(vegaPaths); err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service starter: %v", err))
		return fmt.Errorf("couldn't initialise the service starter: %v", err)
	}

	return nil
}

func (h *Handler) closeAllResources() {
	if h.runningServiceManager.IsServiceRunning() {
		h.runningServiceManager.ShutdownService()
	}

	if h.resourcesCloser != nil {
		h.resourcesCloser.CloseAll()
	}

	h.serviceStarter = nil
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

func (h *Handler) initialiseServiceStarter(vegaPaths paths.Paths) error {
	svcStore, err := svcStoreV1.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service store: %v", err))
		return fmt.Errorf("could not initialise the service store: %w", err)
	}

	loggerBuilderFunc := func(levelName string) (*zap.Logger, zap.AtomicLevel, error) {
		svcLog, svcLogPath, level, err := buildServiceLogger(vegaPaths, paths.WalletServiceLogsHome, levelName)
		if err != nil {
			return nil, zap.AtomicLevel{}, err
		}
		h.runningServiceManager.SetLogPath(svcLogPath)
		return svcLog, level, nil
	}

	policyBuilderFunc := func(_ context.Context) serviceV1.Policy {
		return &unsupportedV1APIPolicy{}
	}

	interactorBuilderFunc := func(ctx context.Context) walletapi.Interactor {
		receptionChan := make(chan interactor.Interaction, 100)
		responseChan := make(chan interactor.Interaction, 100)
		h.runningServiceManager.receptionChan = receptionChan
		h.runningServiceManager.responseChan = responseChan
		h.runningServiceManager.OnShutdown(func() {
			close(receptionChan)
			close(responseChan)
		})
		return interactor.NewSequentialInteractor(ctx, receptionChan, responseChan)
	}

	h.serviceStarter = service.NewStarter(
		h.walletStore,
		h.networkStore,
		svcStore,
		h.connectionsManager,
		policyBuilderFunc,
		interactorBuilderFunc,
		loggerBuilderFunc,
	)

	return nil
}

func (h *Handler) initializeWalletAdminAPI() {
	nodeSelectorBuilder := func(hosts []string, retries uint64) (nodeapi.Selector, error) {
		nodeSelector, err := nodeapi.BuildRoundRobinSelectorWithRetryingNodes(h.log, hosts, retries)
		if err != nil {
			h.log.Error(fmt.Sprintf("Could not initialise the node selector for wallet API: %v", err))
			return nil, fmt.Errorf("could not initialise the node selector for wallet API: %w", err)
		}
		return nodeSelector, nil
	}

	walletAPI, err := walletapi.AdminAPI(
		h.log.Named("json-api"),
		h.walletStore,
		h.networkStore,
		nodeSelectorBuilder,
		h.connectionsManager,
	)
	if err != nil {
		h.log.Error("Could not initialize the wallet administration API", zap.Error(err))
		return
	}
	h.walletAdminAPI = walletAPI
}

func (h *Handler) updateAppLogLevel(level string) error {
	resolvedLevel, err := zapcore.ParseLevel(level)
	if err != nil {
		return fmt.Errorf("invalid log level: %w", err)
	}
	h.logLevel.SetLevel(resolvedLevel)
	return nil
}

func (h *Handler) appConfig() (app.Config, error) {
	c, err := h.configLoader.GetConfig()
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't load the application configuration: %v", err))
		return app.Config{}, fmt.Errorf("could not load the application configuration: %w", err)
	}

	return c, nil
}
