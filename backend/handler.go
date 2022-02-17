package backend

import (
	"context"
	"errors"
	"fmt"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	"code.vegaprotocol.io/vegawallet/service"
	svcstore "code.vegaprotocol.io/vegawallet/service/store/v1"
	wstore "code.vegaprotocol.io/vegawallet/wallet/store/v1"
	"code.vegaprotocol.io/vegawallet/wallets"
	"github.com/wailsapp/wails/v2/pkg/logger"
)

var (
	ErrConsoleAlreadyRunning   = errors.New("the console is already running")
	ErrConsoleNotRunning       = errors.New("the console is not running")
	ErrProgramIsNotInitialised = errors.New("program hasn't been initialised correctly")
)

type Handler struct {
	// This context needs to be kept, as advised by Wails documentation, as it's
	// the one to inject on runtime methods like menu, event, dialogs, etc.
	ctx context.Context

	log logger.Logger

	configLoader *config.Loader
	service      *serviceState
}

func NewHandler(log logger.Logger) *Handler {
	return &Handler{
		log: log,
	}
}

// Startup is called at application Startup
func (h *Handler) Startup(ctx context.Context) {
	h.ctx = ctx

	h.log.Debug("Entering WailsInit")
	defer h.log.Debug("Leaving WailsInit")

	loader, err := config.NewLoader()
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't create configuration loader: %v", err))
	}

	h.configLoader = loader
	h.service = &serviceState{}
}

// DOMReady is called after the front-end dom has been loaded
func (h *Handler) DOMReady(ctx context.Context) {
	// Add your action here
}

// Shutdown is called at application termination
func (h *Handler) Shutdown(_ context.Context) {
	h.log.Debug("Entering WailsShutdown")
	defer h.log.Debug("Leaving WailsShutdown")

	if h.service.IsRunning() {
		h.log.Info("Shutting down the console")
		h.service.Shutdown()
	}
}

func (h *Handler) IsAppInitialised() (bool, error) {
	isConfigInit, err := h.configLoader.IsConfigInitialised()

	if err != nil {
		return false, fmt.Errorf("couldn't verify application configuration state: %w", err)
	}

	if !isConfigInit {
		return false, nil
	}

	cfg, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

	svcStore, err := svcstore.InitialiseStore(paths.New(cfg.VegaHome))
	if err != nil {
		return false, fmt.Errorf("couldn't initialise service store: %w", err)
	}

	isServiceInit, err := service.IsInitialised(svcStore)
	if err != nil {
		return false, fmt.Errorf("couldn't verify service initialisation state: %w", err)
	}

	return isServiceInit, nil
}

func (h *Handler) InitialiseApp(cfg *config.Config) error {
	_, err := wallets.InitialiseStore(cfg.VegaHome)
	if err != nil {
		return fmt.Errorf("couldn't initialise wallets store: %w", err)
	}

	svcStore, err := svcstore.InitialiseStore(paths.New(cfg.VegaHome))
	if err != nil {
		return fmt.Errorf("couldn't initialise service store: %w", err)
	}

	if err = service.InitialiseService(svcStore, true); err != nil {
		return fmt.Errorf("couldn't initialise the service: %w", err)
	}

	if err := h.configLoader.SaveConfig(*cfg); err != nil {
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
