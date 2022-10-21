package backend

import (
	"context"
	"fmt"

	"code.vegaprotocol.io/vega/libs/jsonrpc"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	nodeapi "code.vegaprotocol.io/vega/wallet/api/node"
	netstore "code.vegaprotocol.io/vega/wallet/network/store/v1"
	svcstore "code.vegaprotocol.io/vega/wallet/service/store/v1"
	wstore "code.vegaprotocol.io/vega/wallet/wallet/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
	"code.vegaprotocol.io/vegawallet-desktop/backend/service"
	"code.vegaprotocol.io/vegawallet-desktop/logger"
	"go.uber.org/zap"
)

type Handler struct {
	// This context needs to be kept, as advised by Wails documentation, as it's
	// the one to inject on runtime methods like menu, event, dialogs, etc.
	ctx context.Context

	log *zap.Logger

	configLoader *config.Loader

	walletAPI *jsonrpc.API

	service *service.State
}

func NewHandler() (*Handler, error) {
	handler := &Handler{}

	configLoader, err := config.NewLoader()
	if err != nil {
		return nil, fmt.Errorf("could not create the configuration loader: %w", err)
	}
	handler.configLoader = configLoader

	isConfigInit, err := handler.configLoader.IsConfigInitialised()
	if err != nil {
		return nil, fmt.Errorf("could not verify the application configuration state: %w", err)
	}

	var cfg config.Config
	if !isConfigInit {
		cfg, err = configLoader.GenerateDefaultConfig()
		if err != nil {
			return nil, fmt.Errorf("could not generate the default configuration: %w", err)
		}
	} else {
		cfg, err = configLoader.GetConfig()
		if err != nil {
			return nil, fmt.Errorf("could not load the configuration: %w", err)
		}
	}

	log, err := logger.New(cfg.LogLevel, configLoader.LogFilePathForApp())
	if err != nil {
		return nil, err
	}

	handler.log = log.Named("backend")

	if err := handler.initializeWalletAPI(cfg); err != nil {
		handler.log.Error("Could not initialize the wallet JSON-RPC API", zap.Error(err))
		return nil, err
	}

	handler.log.Info("Application backend has been successfully initialised")

	return handler, nil
}

// Startup is called at application Startup
func (h *Handler) Startup(ctx context.Context) {
	h.ctx = ctx

	h.log.Debug("Entering Startup")
	defer h.log.Debug("Leaving Startup")

	h.service = service.NewState()
}

// DOMReady is called after the front-end dom has been loaded
func (h *Handler) DOMReady(_ context.Context) {
	// Add your action here
}

// Shutdown is called at application termination
func (h *Handler) Shutdown(_ context.Context) {
	h.log.Debug("Entering Shutdown")
	defer h.log.Debug("Leaving Shutdown")

	_ = h.StopService()
}

func (h *Handler) IsAppInitialised() (bool, error) {
	isConfigInit, err := h.configLoader.IsConfigInitialised()
	if err != nil {
		return false, fmt.Errorf("couldn't verify application configuration state: %w", err)
	}

	return isConfigInit, nil
}

type InitialiseAppRequest struct {
	VegaHome string `json:"vegaHome"`
}

func (h *Handler) InitialiseApp(req *InitialiseAppRequest) error {
	h.log.Debug("Entering InitialiseApp")
	defer h.log.Debug("Leaving InitialiseApp")

	cfg := config.Config{
		LogLevel: zap.InfoLevel.String(),
		VegaHome: req.VegaHome,
		// We will opt in first. We will remove this once the on-boarding
		// workflow is rework to ask for user explicit consent.
		Telemetry: config.TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		},
	}

	if err := h.configLoader.SaveConfig(cfg); err != nil {
		h.log.Error("could not save the configuration", zap.Error(err))
		return err
	}

	if err := h.initializeWalletAPI(cfg); err != nil {
		return err
	}

	return nil
}

func (h *Handler) getServiceStore(config config.Config) (*svcstore.Store, error) {
	st, err := svcstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service store: %v", err))
		return nil, fmt.Errorf("couldn't initialise the service store: %w", err)
	}

	return st, nil
}

func (h *Handler) getNetworksStore(config config.Config) (*netstore.Store, error) {
	st, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the networks store: %v", err))
		return nil, fmt.Errorf("couldn't initialise the networks store: %w", err)
	}

	return st, nil
}

func (h *Handler) getWalletsStore(config config.Config) (*wstore.Store, error) {
	store, err := wallets.InitialiseStore(config.VegaHome)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the wallets store: %v", err))
		return nil, fmt.Errorf("couldn't initialise the wallets store: %w", err)
	}
	return store, nil
}

func (h *Handler) loadAppConfig() (config.Config, error) {
	c, err := h.configLoader.GetConfig()
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't load configuration: %v", err))
		return config.Config{}, fmt.Errorf("couldn't load configuration: %w", err)
	}

	return c, nil
}

func (h *Handler) initializeWalletAPI(cfg config.Config) error {
	vegaPaths := paths.New(cfg.VegaHome)

	netStore, err := netstore.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("could not initialise the network store: %v", err))
		return fmt.Errorf("could not initialise the network store: %w", err)
	}

	walletStore, err := wallets.InitialiseStoreFromPaths(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("could not initialise the wallets store: %v", err))
		return fmt.Errorf("could not initialise the wallets store: %w", err)
	}

	nodeSelectorBuilder := func(hosts []string, retries uint64) (nodeapi.Selector, error) {
		nodeSelector, err := nodeapi.BuildRoundRobinSelectorWithRetryingNodes(h.log, hosts, retries)
		if err != nil {
			h.log.Error(fmt.Sprintf("could not initialise the node selector for wallet API: %v", err))
			return nil, fmt.Errorf("could not initialise the node selector for wallet API: %w", err)
		}
		return nodeSelector, nil
	}

	walletAPI, err := walletapi.AdminAPI(h.log.Named("json-api"), walletStore, netStore, nodeSelectorBuilder)
	if err != nil {
		h.log.Error("could not initialize the wallet administration API", zap.Error(err))
		return fmt.Errorf("could not initialize the wallet administration API: %w", err)
	}

	h.walletAPI = walletAPI

	return nil
}
