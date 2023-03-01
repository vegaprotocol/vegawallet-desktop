package backend

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"

	vgclose "code.vegaprotocol.io/vega/libs/close"
	"code.vegaprotocol.io/vega/libs/jsonrpc"
	vgrand "code.vegaprotocol.io/vega/libs/rand"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	netStoreV1 "code.vegaprotocol.io/vega/wallet/network/store/v1"
	svcStoreV1 "code.vegaprotocol.io/vega/wallet/service/store/v1"
	serviceV2 "code.vegaprotocol.io/vega/wallet/service/v2"
	"code.vegaprotocol.io/vega/wallet/service/v2/connections"
	tokenStoreV1 "code.vegaprotocol.io/vega/wallet/service/v2/connections/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallet"
	walletStoreV1 "code.vegaprotocol.io/vega/wallet/wallet/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/os"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Handler struct {
	// This context needs to be kept, as advised by Wails documentation, as it's
	// the one to inject on runtime methods like menu, event, dialogs, etc.
	ctx context.Context

	// To prevent multiple startup of the back and thus resource leaks.
	backendStarted atomic.Bool
	startupMu      sync.Mutex

	// appInitialised represents the initialization state of the application
	// and is used to prevent calls to the API when the application is not
	// initialized.
	appInitialised atomic.Bool

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

	// serviceStarter supersedes the original service starter with mechanisms
	// specific to this software.
	serviceStarter *ServiceStarter

	// walletAdminAPI is the core backend of the wallet, that is shared by every
	// vega wallet implementation. Implementation specific features are exposed
	// as wails backend functions.
	walletAdminAPI *jsonrpc.Dispatcher

	networkStore       *netStoreV1.FileStore
	walletStore        *walletStoreV1.FileStore
	connectionsManager *connections.Manager
	tokenStore         *tokenStoreV1.EmptyStore
	svcStore           *svcStoreV1.Store

	icon []byte
}

func NewHandler(icon []byte) *Handler {
	return &Handler{icon: icon}
}

// Startup is called during application startup
func (h *Handler) Startup(ctx context.Context) {
	h.ctx = ctx
}

// DOMReady is called after the front-end dom has been loaded
func (h *Handler) DOMReady(_ context.Context) {}

// Shutdown is called during application termination
func (h *Handler) Shutdown(_ context.Context) {
	h.closeAllResources()
	h.backendStarted.Store(false)
}

func (h *Handler) StartupBackend() (err error) {
	h.startupMu.Lock()
	defer h.startupMu.Unlock()

	if h.backendStarted.Load() {
		return nil
	}

	defer func() {
		if err == nil {
			// Only set the backend as started on success.
			h.backendStarted.Store(true)
		}
	}()

	if err := h.initializeAppLogger(); err != nil {
		return err
	}

	h.configLoader, err = app.NewConfigLoader()
	if err != nil {
		return fmt.Errorf("could not create the configuration loader: %w", err)
	}

	appInitialised, err := h.isAppInitialised()
	if err != nil {
		return fmt.Errorf("could not verify wheter the application is initialized or not: %w", err)
	}

	h.appInitialised.Store(appInitialised)

	// If the application is not initialized, it means it's the first time the
	// user is running the application. As a result, we can't load the backend
	// components that require an existing configuration. The user will have
	// to go through the application initialization process, that is part of
	// the "on-boarding" workflow on the front-end.
	if h.appInitialised.Load() {
		if err := h.reloadBackendComponentsFromConfig(); err != nil {
			return fmt.Errorf("could not load the backend components during the application start up: %w", err)
		}
	}

	if err := os.Init(); err != nil {
		h.log.Error("Could not initialize OS-specific capabilities")
		return err
	}

	return nil
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

	// We ensure the default network is not set to a network that doesn't exist
	// any more.
	if cfg.DefaultNetwork != "" {
		if exists, err := h.networkStore.NetworkExists(cfg.DefaultNetwork); err != nil {
			return fmt.Errorf("could not verify the network exists: %w", err)
		} else if !exists {
			cfg.DefaultNetwork = ""
			if err := h.configLoader.SaveConfig(cfg); err != nil {
				return fmt.Errorf("could not save the correction to the default network: %w", err)
			}
		}
	}

	walletStore, err := wallets.InitialiseStoreFromPaths(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the wallets store: %v", err))
		return fmt.Errorf("could not initialise the wallets store: %w", err)
	}
	h.walletStore = walletStore

	h.walletStore.OnUpdate(func(ctx context.Context, event wallet.Event) {
		runtime.EventsEmit(h.ctx, string(event.Type), event.Data)
	})

	svcStore, err := svcStoreV1.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service store: %v", err))
		return fmt.Errorf("could not initialise the service store: %w", err)
	}
	h.svcStore = svcStore

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

	serviceStarter, err := NewServiceStarter(
		vegaPaths,
		h.log.Named("service-starter"),
		h.svcStore,
		h.walletStore,
		h.networkStore,
		h.connectionsManager,
	)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service starter: %v", err))
		return fmt.Errorf("couldn't initialise the service starter: %v", err)
	}

	h.serviceStarter = serviceStarter

	if err := h.ensureDefaultNetworksPresence(); err != nil {
		return fmt.Errorf("could not ensure the presence of the default networks: %w", err)
	}

	return nil
}

func (h *Handler) closeAllResources() {
	if h.serviceStarter != nil {
		h.serviceStarter.Close()
	}

	if h.resourcesCloser != nil {
		h.resourcesCloser.CloseAll()
	}

	h.serviceStarter = nil
}

func (h *Handler) ensureDefaultNetworksPresence() error {
	registeredNetworks, err := h.networkStore.ListNetworks()
	if err != nil {
		return fmt.Errorf("could not list the registered networks: %w", err)
	}

	for _, defaultNet := range DefaultNetworks {
		h.importDefaultNetworkIfMissing(h.ctx, defaultNet, registeredNetworks)
	}

	return nil
}

func (h *Handler) importDefaultNetworkIfMissing(ctx context.Context, defaultNetwork DefaultNetwork, registeredNetworks []string) {
	for _, registeredNetwork := range registeredNetworks {
		if registeredNetwork == defaultNetwork.Name {
			return
		}
	}

	reqCtx := context.WithValue(ctx, jsonrpc.TraceIDKey, vgrand.RandomStr(64))

	resp := h.walletAdminAPI.DispatchRequest(reqCtx, jsonrpc.Request{
		Version: jsonrpc.VERSION2,
		Method:  "admin.import_network",
		Params: walletapi.AdminImportNetworkParams{
			Name:      defaultNetwork.Name,
			URL:       defaultNetwork.URL,
			Overwrite: false,
		},
		ID: fmt.Sprintf("automatic-network-import-%s", defaultNetwork.Name),
	})
	if resp.Error != nil {
		h.log.Error("Could not import a default network", zap.String("network", defaultNetwork.Name), zap.Error(resp.Error))
		return
	}
	h.log.Info("A default network has been automatically imported", zap.String("network", defaultNetwork.Name))
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
