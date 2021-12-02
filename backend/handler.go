package backend

import (
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
	ErrNoWalletFound         = errors.New("no wallet found at this location")
)

type Handler struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger

	configLoader     *config.Loader
	isAppInitialised bool

	console *consoleState
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

	if err = s.verifyAppInitialisation(); err != nil {
		return err
	}

	s.console = &consoleState{}

	return nil
}

func (s *Handler) WailsShutdown() {
	s.log.Debug("Entering WailsShutdown")
	defer s.log.Debug("Leaving WailsShutdown")

	if s.console.IsRunning() {
		s.log.Info("Shutting down the console")
		s.console.Shutdown()
	}
}

func (s *Handler) IsAppInitialised() bool {
	return s.isAppInitialised
}

func (s *Handler) verifyAppInitialisation() error {
	s.isAppInitialised = false

	initialised, err := s.configLoader.IsConfigInitialised()
	if err != nil {
		s.log.Errorf("Couldn't verify configuration initialisation state: %v", err)
		return fmt.Errorf("couldn't verify configuration initialisation state: %w", err)
	}

	if !initialised {
		c := config.Config{VegaHome: ""}
		err = s.configLoader.SaveConfig(c)
		if err != nil {
			s.log.Errorf("Couldn't save default configuration: %v", err)
			return fmt.Errorf("couldn't save default configuration: %w", err)
		}
	}

	configFilePath := s.configLoader.ConfigFilePath()
	s.log.Debugf("Loading configuration located at %s", configFilePath)

	c, err := s.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := s.getWalletsStore(c)
	if err != nil {
		return err
	}

	ws, err := wStore.ListWallets()
	if err != nil {
		s.log.Errorf("Couldn't list wallets: %v", err)
		return fmt.Errorf("couldn't list wallets: %w", err)
	}

	s.isAppInitialised = len(ws) != 0

	return nil
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
