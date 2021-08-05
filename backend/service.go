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
	"code.vegaprotocol.io/go-wallet/fsutil"
	"code.vegaprotocol.io/go-wallet/logger"
	"code.vegaprotocol.io/go-wallet/service"
	svcstore "code.vegaprotocol.io/go-wallet/service/store/v1"
	"code.vegaprotocol.io/go-wallet/wallet"
	wstore "code.vegaprotocol.io/go-wallet/wallet/store/v1"

	"github.com/skratchdot/open-golang/open"
	"github.com/wailsapp/wails"
)

var (
	ErrFailedToInitialiseService     = errors.New("failed to initialise the service")
	ErrFailedToRetrieveServiceConfig = errors.New("failed to retrieve the service configuration")
	ErrFailedToSaveServiceConfig     = errors.New("failed to save the service configuration")
	ErrFailedToStartTheConsole       = errors.New("failed to start the console")
	ErrConsoleAlreadyRunning         = errors.New("the console is already running")
	ErrConsoleNotRunning             = errors.New("the console is not running")

	rootPath = fsutil.DefaultVegaDir()
)

type Service struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger

	svcStore *svcstore.Store

	shutdownFunc func()
}

func (s *Service) WailsInit(runtime *wails.Runtime) error {
	s.log = runtime.Log.New("Service")
	s.log.Debug("Entering WailsInit")
	defer s.log.Debug("Leaving WailsInit")

	s.runtime = runtime

	st, err := svcstore.NewStore(rootPath)
	if err != nil {
		s.log.Errorf("Couldn't create the service store: %v", err)
		return ErrFailedToInitialiseService
	}

	err = st.Initialise()
	if err != nil {
		s.log.Errorf("Couldn't initialise the service store: %v", err)
		return ErrFailedToInitialiseService
	}

	s.svcStore = st

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

func (s *Service) GetConfig() (*service.Config, error) {
	s.log.Debug("Entering GetConfig")
	defer s.log.Debug("Leaving GetConfig")

	config, err := s.svcStore.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("couldn't retrieve the service configuration: %v", err))
		return nil, ErrFailedToRetrieveServiceConfig
	}

	return config, nil
}

func (s *Service) SaveConfig(jsonConfig string) (bool, error) {
	s.log.Debug("Entering SaveConfig")
	defer s.log.Debug("Leaving SaveConfig")

	config := &service.Config{}
	err := json.Unmarshal([]byte(jsonConfig), config)
	if err != nil {
		s.log.Errorf("couldn't unmarshall JSON config: %v", err)
		return false, ErrFailedToSaveServiceConfig
	}

	err = s.svcStore.SaveConfig(config, true)
	if err != nil {
		s.log.Errorf("couldn't save the service configuration: %v", err)
		return false, ErrFailedToSaveServiceConfig
	}

	return true, nil
}

func (s *Service) StartConsole() (bool, error) {
	s.log.Debug("Entering StartConsole")
	defer s.log.Debug("Leaving StartConsole")

	if s.shutdownFunc != nil {
		s.log.Error("a console already started")
		return false, ErrConsoleAlreadyRunning
	}

	walletsPath := filepath.Join(rootPath, "wallets")

	wStore, err := wstore.NewStore(walletsPath)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the wallet store: %v", err)
		return false, err
	}

	handler := wallet.NewHandler(wStore)

	svcStore, err := svcstore.NewStore(rootPath)
	if err != nil {
		return false, err
	}

	config, err := svcStore.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("couldn't retrieve the service configuration: %v", err))
		return false, ErrFailedToRetrieveServiceConfig
	}

	log, err := logger.New(config.Level.Level)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service logger: %v", err)
		return false, ErrFailedToStartTheConsole
	}
	defer log.Sync()

	ctx, shutdown := context.WithCancel(context.Background())
	defer shutdown()

	s.shutdownFunc = shutdown

	srv, err := service.NewService(log, config, svcStore, handler)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service: %v", err)
		return false, ErrFailedToStartTheConsole
	}

	cs := console.NewConsole(
		config.Console.LocalPort,
		config.Console.URL,
		config.Nodes.Hosts[0],
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
		s.log.Error("no console running")
		return false, ErrConsoleNotRunning
	}

	s.log.Info("Shutting down the console")
	s.shutdownFunc()

	s.shutdownFunc = nil

	return true, nil
}
