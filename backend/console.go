package backend

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"code.vegaprotocol.io/go-wallet/console"
	"code.vegaprotocol.io/go-wallet/logger"
	"code.vegaprotocol.io/go-wallet/service"
	svcstore "code.vegaprotocol.io/go-wallet/service/store/v1"
	"code.vegaprotocol.io/go-wallet/wallet"
	"github.com/skratchdot/open-golang/open"
)

type StartConsoleResponse struct {
	URL string
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
