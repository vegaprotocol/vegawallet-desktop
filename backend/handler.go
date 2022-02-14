package backend

import (
	"encoding/json"
	"errors"
	"fmt"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	svcstore "code.vegaprotocol.io/vegawallet/service/store/v1"
	wstore "code.vegaprotocol.io/vegawallet/wallet/store/v1"
	"code.vegaprotocol.io/vegawallet/wallets"
	"github.com/wailsapp/wails"
)

var (
	ErrConsoleAlreadyRunning = errors.New("the console is already running")
	ErrConsoleNotRunning     = errors.New("the console is not running")
)

type Handler struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger

	configLoader *config.Loader
	service      *serviceState
}

func (h *Handler) WailsInit(runtime *wails.Runtime) error {
	h.log = runtime.Log.New("Handler")

	h.log.Debug("Entering WailsInit")
	defer h.log.Debug("Leaving WailsInit")

	h.runtime = runtime

	loader, err := config.NewLoader()
	if err != nil {
		h.log.Errorf("Couldn't create configuration loader: %v", err)
		return fmt.Errorf("couldn't create configuration loader: %w", err)
	}

	h.configLoader = loader
	h.service = &serviceState{}

	return nil
}

func (h *Handler) WailsShutdown() {
	h.log.Debug("Entering WailsShutdown")
	defer h.log.Debug("Leaving WailsShutdown")

	if h.service.IsRunning() {
		h.log.Info("Shutting down the console")
		h.service.Shutdown()
	}
}

func (h *Handler) IsAppInitialised() (bool, error) {
	return h.configLoader.IsConfigInitialised()
}

func (h *Handler) InitialiseApp(data string) error {
	cfg := &config.Config{}
	if err := json.Unmarshal([]byte(data), cfg); err != nil {
		h.log.Errorf("Couldn't unmarshall config: %v", err)
		return fmt.Errorf("couldn't unmarshal config: %w", err)
	}

	return h.configLoader.SaveConfig(*cfg)
}

func (h *Handler) getServiceStore(config config.Config) (*svcstore.Store, error) {
	st, err := svcstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Errorf("Couldn't initialise the service store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the service store: %w", err)
	}

	return st, nil
}

func (h *Handler) getNetworksStore(config config.Config) (*netstore.Store, error) {
	st, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Errorf("Couldn't initialise the networks store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the networks store: %w", err)
	}

	return st, nil
}

func (h *Handler) getWalletsStore(config config.Config) (*wstore.Store, error) {
	store, err := wallets.InitialiseStore(config.VegaHome)
	if err != nil {
		h.log.Errorf("Couldn't initialise the wallets store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the wallets store: %w", err)
	}
	return store, nil
}

func (h *Handler) loadAppConfig() (config.Config, error) {
	c, err := h.configLoader.GetConfig()
	if err != nil {
		h.log.Errorf("Couldn't load configuration: %v", err)
		return config.Config{}, fmt.Errorf("couldn't load configuration: %w", err)
	}

	return c, nil
}
