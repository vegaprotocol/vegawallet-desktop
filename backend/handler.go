package backend

import (
	"context"
	"errors"
	"fmt"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
	"code.vegaprotocol.io/vegawallet-desktop/backend/proxy"
	"code.vegaprotocol.io/vegawallet-desktop/backend/service"
	"code.vegaprotocol.io/vegawallet/network"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	svcstore "code.vegaprotocol.io/vegawallet/service/store/v1"
	wstore "code.vegaprotocol.io/vegawallet/wallet/store/v1"
	"code.vegaprotocol.io/vegawallet/wallets"
	"go.uber.org/zap"
)

var (
	ErrServiceAlreadyRunning   = errors.New("the service is already running")
	ErrServiceNotRunning       = errors.New("the service is not running")
	ErrConsoleAlreadyRunning   = errors.New("the console proxy is already running")
	ErrConsoleNotRunning       = errors.New("the console proxy is not running")
	ErrTokenDAppAlreadyRunning = errors.New("the token dApp proxy is already running")
	ErrTokenDAppNotRunning     = errors.New("the token dApp proxy is not running")
)

type Handler struct {
	// This context needs to be kept, as advised by Wails documentation, as it's
	// the one to inject on runtime methods like menu, event, dialogs, etc.
	ctx context.Context

	log *zap.Logger

	configLoader *config.Loader

	service   *service.State
	console   *proxy.State
	tokenDApp *proxy.State
}

func NewHandler() (*Handler, error) {
	loader, err := config.NewLoader()
	if err != nil {
		return nil, fmt.Errorf("couldn't create configuration loader: %w", err)
	}

	var logLevel string
	if cfg, err := loader.GetConfig(); err != nil {
		logLevel = zap.InfoLevel.String()
	} else {
		logLevel = cfg.LogLevel
	}

	log, err := buildLogger(logLevel, loader.LogFilePathForApp())
	if err != nil {
		return nil, err
	}

	return &Handler{
		log:          log,
		configLoader: loader,
	}, nil
}

// Startup is called at application Startup
func (h *Handler) Startup(ctx context.Context) {
	h.ctx = ctx

	h.log.Debug("Entering Startup")
	defer h.log.Debug("Leaving Startup")

	h.service = service.NewState()
	h.console = proxy.NewState()
	h.tokenDApp = proxy.NewState()
}

// DOMReady is called after the front-end dom has been loaded
func (h *Handler) DOMReady(ctx context.Context) {
	// Add your action here
}

// Shutdown is called at application termination
func (h *Handler) Shutdown(_ context.Context) {
	h.log.Debug("Entering Shutdown")
	defer h.log.Debug("Leaving Shutdown")

	_, _ = h.StopConsole()
	_, _ = h.StopTokenDApp()
	_, _ = h.StopService()
}

func (h *Handler) IsAppInitialised() (bool, error) {
	isConfigInit, err := h.configLoader.IsConfigInitialised()
	if err != nil {
		h.log.Error("Could not verify the application is initialized", zap.Error(err))
		return false, fmt.Errorf("could not verify the application is initialized: %w", err)
	}

	if !isConfigInit {
		return false, nil
	}
	cfg, err := h.configLoader.GetConfig()
	if err != nil {
		return false, err
	}

	netStore, err := h.getNetworksStore(cfg)
	if err != nil {
		return false, err
	}

	for _, defNet := range DefaultNetworks {
		exist, err := netStore.NetworkExists(defNet.Name)
		if err != nil {
			continue
		}
		if !exist {
			res, err := network.ImportNetworkFromSource(netStore, network.NewReaders(), &network.ImportNetworkFromSourceRequest{
				URL: defNet.URL,
			})
			if err != nil {
				h.log.Error("Could not import a network",
					zap.String("network", defNet.Name),
					zap.Error(err),
				)
			}
			h.log.Info("Successfully Imported the network",
				zap.String("network", res.Name),
				zap.String("path", res.FilePath),
			)
		}
	}

	return true, nil
}

type InitialiseAppRequest struct {
	VegaHome string `json:"vegaHome"`
}

func (h *Handler) InitialiseApp(req *InitialiseAppRequest) error {
	h.log.Debug("Entering InitialiseApp")
	defer h.log.Debug("Leaving InitialiseApp")

	cfg := &config.Config{
		LogLevel: zap.InfoLevel.String(),
		VegaHome: req.VegaHome,
		// We will opt in first. We will remove this once the on-boarding
		// workflow is rework to ask for user explicit consent.
		Telemetry: &config.TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		},
		OnBoardingDone: true,
	}

	if err := h.configLoader.SaveConfig(*cfg); err != nil {
		return err
	}

	netStore, err := h.getNetworksStore(*cfg)
	if err != nil {
		return err
	}

	existingNets, err := netStore.ListNetworks()
	if err != nil {
		return fmt.Errorf("could not list existing network: %w", err)
	}

	h.log.Info("Delete all existing network to ensure clean state")
	for _, existingNet := range existingNets {
		if err := netStore.DeleteNetwork(existingNet); err != nil {
			h.log.Error("Could not delete an existing network during initialization",
				zap.String("network", existingNet),
				zap.Error(err),
			)
		}
		h.log.Info("Successfully deleted the network", zap.String("network", existingNet))
	}

	h.log.Info("Import networks for which this software is optimized")
	for _, defaultNetwork := range DefaultNetworks {
		res, err := network.ImportNetworkFromSource(netStore, network.NewReaders(), &network.ImportNetworkFromSourceRequest{
			URL: defaultNetwork.URL,
		})
		if err != nil {
			h.log.Error("Could not import a network during initialization",
				zap.String("network", defaultNetwork.Name),
				zap.Error(err),
			)
		}
		h.log.Info("Successfully imported the network",
			zap.String("network", res.Name),
			zap.String("path", res.FilePath),
		)
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
