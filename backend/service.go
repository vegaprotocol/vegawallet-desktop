package backend

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"code.vegaprotocol.io/go-wallet/console"
	vgwfs "code.vegaprotocol.io/go-wallet/libs/fs"
	"code.vegaprotocol.io/go-wallet/logger"
	"code.vegaprotocol.io/go-wallet/service"
	svcstore "code.vegaprotocol.io/go-wallet/service/store/v1"
	"code.vegaprotocol.io/go-wallet/wallet"
	wstore "code.vegaprotocol.io/go-wallet/wallet/store/v1"

	"github.com/skratchdot/open-golang/open"
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

	shutdownFunc func()
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

	return nil
}

func (s *Service) WailsShutdown() {
	s.log.Debug("Entering WailsShutdown")
	defer s.log.Debug("Leaving WailsShutdown")

	if s.shutdownFunc != nil {
		s.log.Info("Shutting down the console")
		s.shutdownFunc()
		s.shutdownFunc = nil
	}
}

func (s *Service) IsAppInitialised() bool {
	return s.isAppInitialised
}

func (s *Service) GetConfig() (*service.Config, error) {
	s.log.Debug("Entering GetConfig")
	defer s.log.Debug("Leaving GetConfig")

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

func (s *Service) SaveConfig(jsonConfig string) (bool, error) {
	s.log.Debug("Entering SaveConfig")
	defer s.log.Debug("Leaving SaveConfig")

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

func (s *Service) StartConsole() (bool, error) {
	s.log.Debug("Entering StartConsole")
	defer s.log.Debug("Leaving StartConsole")

	if s.shutdownFunc != nil {
		s.log.Error("A console already started")
		return false, ErrConsoleAlreadyRunning
	}

	config, err := s.loadConfig()
	if err != nil {
		return false, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return false, err
	}

	handler := wallet.NewHandler(wStore)

	svcStore, err := svcstore.NewStore(config.WalletRootPath)
	if err != nil {
		return false, err
	}

	svcConfig, err := svcStore.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return false, ErrFailedToRetrieveServiceConfig
	}

	log, err := logger.New(svcConfig.Level.Level)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service logger: %v", err)
		return false, ErrFailedToStartTheConsole
	}
	defer log.Sync()

	ctx, shutdown := context.WithCancel(context.Background())
	defer shutdown()

	s.shutdownFunc = shutdown

	srv, err := service.NewService(log, svcConfig, svcStore, handler)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service: %v", err)
		return false, ErrFailedToStartTheConsole
	}

	cs := console.NewConsole(
		svcConfig.Console.LocalPort,
		svcConfig.Console.URL,
		svcConfig.Nodes.Hosts[0],
	)

	go func() {
		defer shutdown()
		s.log.Info("Starting the service")
		err := srv.Start()
		if err != nil && err != http.ErrServerClosed {
			s.log.Errorf("Couldn't start the service: %v", err)
		}
	}()

	go func() {
		defer shutdown()
		s.log.Info("Starting the console")
		err := cs.Start()
		if err != nil && err != http.ErrServerClosed {
			s.log.Errorf("Couldn't start the console: %v", err)
		}
	}()

	s.log.Infof("Opening the console at %s", cs.GetBrowserURL())
	err = open.Run(cs.GetBrowserURL())
	if err != nil {
		s.log.Errorf("Couldn't open the default browser: %v", err)
		return false, ErrFailedToStartTheConsole
	}

	s.waitSignal(ctx, shutdown)

	err = cs.Stop()
	if err != nil {
		s.log.Errorf("Couldn't stop the console: %v", err)
	} else {
		s.log.Info("The console stopped")
	}

	err = srv.Stop()
	if err != nil {
		s.log.Errorf("Couldn't stop the service: %v", err)
	} else {
		s.log.Info("The service stopped")
	}

	return true, nil
}

// waitSignal will wait for a sigterm or sigint interrupt.
func (s *Service) waitSignal(ctx context.Context, shutdownFunc func()) {
	var gracefulStop = make(chan os.Signal, 1)
	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)
	signal.Notify(gracefulStop, syscall.SIGQUIT)

	select {
	case sig := <-gracefulStop:
		s.log.Infof("Caught signal %+v", sig)
		shutdownFunc()
	case <-ctx.Done():
		// nothing to do
	}
}

func (s *Service) StopConsole() (bool, error) {
	s.log.Debug("Entering StopConsole")
	defer s.log.Debug("Leaving StopConsole")

	if s.shutdownFunc == nil {
		s.log.Error("No console running")
		return false, ErrConsoleNotRunning
	}

	s.log.Info("Shutting down the console")
	s.shutdownFunc()

	s.shutdownFunc = nil

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
