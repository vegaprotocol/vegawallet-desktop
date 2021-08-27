package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"

	vgwfs "code.vegaprotocol.io/go-wallet/libs/fs"
	"code.vegaprotocol.io/go-wallet/service"
	svcstore "code.vegaprotocol.io/go-wallet/service/store/v1"
	wstore "code.vegaprotocol.io/go-wallet/wallet/store/v1"

	"github.com/wailsapp/wails"
)

var (
	ErrFailedToInitialiseServiceConfigStore = errors.New("failed to initialise the service configuration store")
	ErrFailedToRetrieveServiceConfig        = errors.New("failed to retrieve the service configuration")
	ErrFailedToSaveServiceConfig            = errors.New("failed to save the service configuration")
	ErrFailedToStartTheConsole              = errors.New("failed to start the console")
	ErrConsoleAlreadyRunning                = errors.New("the console is already running")
	ErrConsoleNotRunning                    = errors.New("the console is not running")
	ErrNoWalletFound                        = errors.New("no wallet found at this location")

	defaultVegaDir = vgwfs.DefaultVegaDir()
)

type Service struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger

	isAppInitialised bool

	console *consoleState
}

func (s *Service) WailsInit(runtime *wails.Runtime) error {
	s.log = runtime.Log.New("Service")
	s.log.Debug("Entering WailsInit")
	defer s.log.Debug("Leaving WailsInit")

	s.runtime = runtime

	err := s.verifyConfigInitialisation()
	if err != nil {
		return err
	}

	s.console = &consoleState{}

	return nil
}

func (s *Service) WailsShutdown() {
	s.log.Debug("Entering WailsShutdown")
	defer s.log.Debug("Leaving WailsShutdown")

	if s.console.IsRunning() {
		s.log.Info("Shutting down the console")
		s.console.Shutdown()
	}
}

func (s *Service) IsAppInitialised() bool {
	return s.isAppInitialised
}

func (s *Service) GetServiceConfig() (*service.Config, error) {
	s.log.Debug("Entering GetServiceConfig")
	defer s.log.Debug("Leaving GetServiceConfig")

	config, err := s.loadConfig()
	if err != nil {
		return nil, err
	}

	st, err := s.getServiceStore(config)
	if err != nil {
		return nil, err
	}

	svcConfig, err := st.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return nil, ErrFailedToRetrieveServiceConfig
	}

	return svcConfig, nil
}

func (s *Service) SaveServiceConfig(jsonConfig string) (bool, error) {
	s.log.Debug("Entering SaveServiceConfig")
	defer s.log.Debug("Leaving SaveServiceConfig")

	config, err := s.loadConfig()
	if err != nil {
		return false, err
	}

	st, err := s.getServiceStore(config)
	if err != nil {
		return false, err
	}

	svcConfig := &service.Config{}
	err = json.Unmarshal([]byte(jsonConfig), svcConfig)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall JSON config: %v", err)
		return false, ErrFailedToSaveServiceConfig
	}

	err = st.SaveConfig(svcConfig, true)
	if err != nil {
		s.log.Errorf("Couldn't save the service configuration: %v", err)
		return false, ErrFailedToSaveServiceConfig
	}

	return true, nil
}

func (s *Service) verifyConfigInitialisation() error {
	s.isAppInitialised = false

	hasConfig, err := HasConfig()
	if err != nil {
		s.log.Errorf("Couldn't verify configuration initialisation state: %v", err)
		return err
	}

	if !hasConfig {
		return nil
	}

	configPath, err := LocateConfig()
	if err != nil {
		s.log.Errorf("Couldn't locate configuration: %v", err)
		return err
	}

	s.log.Debugf("Loading configuration located at %s", configPath)

	config, err := s.loadConfig()
	if err != nil {
		return err
	}

	if len(config.WalletRootPath) == 0 {
		return nil
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return err
	}

	wallets, err := wStore.ListWallets()
	if err != nil {
		s.log.Errorf("Couldn't list wallets: %v", err)
		return err
	}

	s.isAppInitialised = len(wallets) != 0

	return nil
}

func (s *Service) getServiceStore(config Config) (*svcstore.Store, error) {
	st, err := svcstore.NewStore(config.WalletRootPath)
	if err != nil {
		s.log.Errorf("Couldn't create the service store: %v", err)
		return nil, ErrFailedToInitialiseServiceConfigStore
	}

	err = st.Initialise()
	if err != nil {
		s.log.Errorf("Couldn't initialise the service store: %v", err)
		return nil, ErrFailedToInitialiseServiceConfigStore
	}
	return st, nil
}

func (s *Service) getWalletsStore(config Config) (*wstore.Store, error) {
	walletsPath := filepath.Join(config.WalletRootPath, "wallets")

	wStore, err := wstore.NewStore(walletsPath)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the wallet store: %v", err)
		return nil, err
	}

	if err := wStore.Initialise(); err != nil {
		s.log.Errorf("Couldn't initialise the wallet store: %v", err)
		return nil, err
	}

	return wStore, nil
}

func (s *Service) loadConfig() (Config, error) {
	config, err := LoadConfig()
	if err != nil {
		s.log.Errorf("Couldn't load configuration: %v", err)
		return Config{}, nil
	}
	return config, err
}
