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
	"code.vegaprotocol.io/go-wallet/node"
	"code.vegaprotocol.io/go-wallet/service"
	svcstore "code.vegaprotocol.io/go-wallet/service/store/v1"
	"code.vegaprotocol.io/go-wallet/wallets"
	"code.vegaprotocol.io/shared/paths"
	"github.com/skratchdot/open-golang/open"
)

type consoleState struct {
	URL          string
	shutdownFunc func()
}

func (s *consoleState) IsRunning() bool {
	return s.shutdownFunc != nil
}

func (s *consoleState) Shutdown() {
	s.shutdownFunc()
	s.shutdownFunc = nil
}

func (s *Handler) StartConsole() (bool, error) {
	s.log.Debug("Entering StartConsole")
	defer s.log.Debug("Leaving StartConsole")

	if s.console.IsRunning() {
		s.log.Error("A console already started")
		return false, ErrConsoleAlreadyRunning
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return false, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return false, err
	}

	handler := wallets.NewHandler(wStore)

	svcStore, err := svcstore.InitialiseStore(paths.NewPaths(config.VegaHome))
	if err != nil {
		return false, fmt.Errorf("couldn't initialise the service store: %w", err)
	}

	svcConfig, err := svcStore.GetConfig()
	if err != nil {
		s.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return false, fmt.Errorf("couldn't retrieve the service configuration: %w", err)
	}

	log, err := logger.New(svcConfig.Level.Level, "json")
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service logger: %v", err)
		return false, fmt.Errorf("couldn't start the console: %w", err)
	}
	defer log.Sync()

	ctx, shutdown := context.WithCancel(context.Background())
	defer shutdown()

	auth, err := service.NewAuth(log.Named("auth"), svcStore, svcConfig.TokenExpiry.Get())
	if err != nil {
		s.log.Errorf("Couldn't instantiate authentication: %v", err)
		return false, fmt.Errorf("couldn't initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), svcConfig.Nodes)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the node forwarder: %v", err)
		return false, fmt.Errorf("couldn't initialise the node forwarder: %w", err)
	}

	srv, err := service.NewService(log.Named("service"), svcConfig, handler, auth, forwarder)
	if err != nil {
		s.log.Errorf("Couldn't instantiate the service: %v", err)
		return false, fmt.Errorf("couldn't instantiate the service: %w", err)
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

	s.console.URL = cs.GetBrowserURL()
	s.console.shutdownFunc = shutdown

	s.log.Infof("Opening the console at %s", cs.GetBrowserURL())
	err = open.Run(cs.GetBrowserURL())
	if err != nil {
		s.log.Errorf("Couldn't open the default browser: %v", err)
		return false, fmt.Errorf("couldn't open the default browser: %w", err)
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

type GetConsoleStateResponse struct {
	URL     string
	Running bool
}

func (s *Handler) GetConsoleState() GetConsoleStateResponse {
	s.log.Debug("Entering GetConsoleState")
	defer s.log.Debug("Leaving GetConsoleState")

	return GetConsoleStateResponse{
		URL:     s.console.URL,
		Running: s.console.IsRunning(),
	}
}

func (s *Handler) StopConsole() (bool, error) {
	s.log.Debug("Entering StopConsole")
	defer s.log.Debug("Leaving StopConsole")

	if !s.console.IsRunning() {
		s.log.Error("No console running")
		return false, ErrConsoleNotRunning
	}

	s.log.Info("Shutting down the console")
	s.console.Shutdown()

	return true, nil
}

// waitSignal will wait for a sigterm or sigint interrupt.
func (s *Handler) waitSignal(ctx context.Context, shutdownFunc func()) {
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
