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

func (s *Handler) WailsInit(runtime *wails.Runtime) error {
	s.log = runtime.Log.New("Handler")

	s.log.Debug("Entering WailsInit")
	defer s.log.Debug("Leaving WailsInit")

	s.runtime = runtime

	loader, err := config.NewLoader()
	if err != nil {
		s.log.Errorf("Couldn't create configuration loader: %v", err)
		return fmt.Errorf("couldn't create configuration loader: %w", err)
	}

	s.configLoader = loader
	s.service = &serviceState{}

	return nil
}

func (s *Handler) WailsShutdown() {
	s.log.Debug("Entering WailsShutdown")
	defer s.log.Debug("Leaving WailsShutdown")

	if s.service.IsRunning() {
		s.log.Info("Shutting down the console")
		s.service.Shutdown()
	}
}

func (s *Handler) IsAppInitialised() (bool, error) {
	return s.configLoader.IsConfigInitialised()
}

func (s *Handler) InitialiseApp(data string) error {
	cfg := &config.Config{}
	if err := json.Unmarshal([]byte(data), cfg); err != nil {
		s.log.Errorf("Couldn't unmarshall config: %v", err)
		return fmt.Errorf("couldn't unmarshal config: %w", err)
	}

	return s.configLoader.SaveConfig(*cfg)
}

func (s *Handler) getServiceStore(config config.Config) (*svcstore.Store, error) {
	st, err := svcstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		s.log.Errorf("Couldn't initialise the service store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the service store: %w", err)
	}

	return st, nil
}

func (s *Handler) getNetworksStore(config config.Config) (*netstore.Store, error) {
	st, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		s.log.Errorf("Couldn't initialise the networks store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the networks store: %w", err)
	}

	return st, nil
}

func (s *Handler) getWalletsStore(config config.Config) (*wstore.Store, error) {
	store, err := wallets.InitialiseStore(config.VegaHome)
	if err != nil {
		s.log.Errorf("Couldn't initialise the wallets store: %v", err)
		return nil, fmt.Errorf("couldn't initialise the wallets store: %w", err)
	}
	return store, nil
}

func (s *Handler) loadAppConfig() (config.Config, error) {
	c, err := s.configLoader.GetConfig()
	if err != nil {
		s.log.Errorf("Couldn't load configuration: %v", err)
		return config.Config{}, fmt.Errorf("couldn't load configuration: %w", err)
	}

	return c, nil
}
