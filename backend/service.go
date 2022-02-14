package backend

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet/network"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	"code.vegaprotocol.io/vegawallet/node"
	"code.vegaprotocol.io/vegawallet/proxy"
	"code.vegaprotocol.io/vegawallet/service"
	svcstore "code.vegaprotocol.io/vegawallet/service/store/v1"
	"code.vegaprotocol.io/vegawallet/wallets"
	"github.com/skratchdot/open-golang/open"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type serviceState struct {
	consoleURL   string
	shutdownFunc func()
}

func (s *serviceState) IsRunning() bool {
	return s.shutdownFunc != nil
}

func (s *serviceState) Shutdown() {
	s.shutdownFunc()
	s.shutdownFunc = nil
}

type StartServiceRequest struct {
	Network       string
	WithConsole   bool
	WithTokenDApp bool
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("network is required")
	}

	return nil
}

func (h *Handler) StartService(data string) (bool, error) {
	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if h.service.IsRunning() {
		h.log.Error("A console already started")
		return false, ErrConsoleAlreadyRunning
	}

	req := &StartServiceRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return false, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err := req.Check(); err != nil {
		return false, err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return false, err
	}

	handler := wallets.NewHandler(wStore)

	netStore, err := netstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Errorf("Couldn't initialise network store: %v", err)
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	exists, err := netStore.NetworkExists(req.Network)
	if err != nil {
		h.log.Errorf("Couldn't verify the network existence: %v", err)
		return false, fmt.Errorf("couldn't verify the network existence: %w", err)
	}
	if !exists {
		h.log.Errorf("Network %s does not exist", req.Network)
		return false, network.NewNetworkDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Errorf("Couldn't initialise network store: %v", err)
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.Level.String()
	log, err := buildLogger(logLevel)
	if err != nil {
		return false, err
	}
	defer syncLogger(log)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	h.service.shutdownFunc = cancel

	svcStore, err := svcstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Errorf("Couldn't initialise service store: %v", err)
		return false, fmt.Errorf("couldn't initialise service store: %w", err)
	}

	auth, err := service.NewAuth(log.Named("auth"), svcStore, cfg.TokenExpiry.Get())
	if err != nil {
		h.log.Errorf("Couldn't initialise authentication: %v", err)
		return false, fmt.Errorf("couldn't initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), cfg.API.GRPC)
	if err != nil {
		h.log.Errorf("Couldn't initialise the node forwarder: %v", err)
		return false, fmt.Errorf("couldn't initialise the node forwarder: %w", err)
	}

	srv, err := service.NewService(log.Named("service"), cfg, handler, auth, forwarder)
	if err != nil {
		h.log.Errorf("Couldn't initialise the service: %v", err)
		return false, err
	}

	go func() {
		defer cancel()
		h.log.Info("Starting the service")
		if err := srv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			h.log.Errorf("Error while starting HTTP server: %v", err)
		}
	}()

	var cs *proxy.Proxy
	if req.WithConsole {
		cons := proxy.NewProxy(
			cfg.Console.LocalPort,
			cfg.Console.URL,
			cfg.API.GRPC.Hosts[0],
		)
		cs = cons

		go func() {
			defer cancel()
			h.log.Info("Starting the console")
			if err := cs.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				h.log.Errorf("Error while starting the console proxy: %v", err)
			}
		}()

		h.service.consoleURL = cs.GetBrowserURL()

		h.log.Infof("Opening the console at %s", cs.GetBrowserURL())

		if err = open.Run(cs.GetBrowserURL()); err != nil {
			h.log.Errorf("Unable to open the console in the default browser: %v", err)
			return false, fmt.Errorf("unable to open the console in the default browser: %w", err)
		}
	}

	var tokenDApp *proxy.Proxy
	if req.WithTokenDApp {
		tda := proxy.NewProxy(
			cfg.TokenDApp.LocalPort,
			cfg.TokenDApp.URL,
			cfg.API.GRPC.Hosts[0],
		)
		tokenDApp = tda

		go func() {
			defer cancel()
			h.log.Info("Starting the token dApp")
			if err := tokenDApp.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
				h.log.Errorf("Error while starting the token dApp proxy: %v", err)
			}
		}()

		h.service.consoleURL = tokenDApp.GetBrowserURL()

		h.log.Infof("Opening the token dApp at %s", tokenDApp.GetBrowserURL())

		if err = open.Run(tokenDApp.GetBrowserURL()); err != nil {
			h.log.Errorf("Unable to open the token dApp in the default browser: %v", err)
			return false, fmt.Errorf("unable to open the token dApp in the default browser: %w", err)
		}
	}

	h.waitSignal(ctx, cancel)

	if req.WithConsole {
		if err = cs.Stop(); err != nil {
			h.log.Errorf("Error while stopping console proxy: %v", err)
		} else {
			h.log.Info("Console proxy stopped with success")
		}
	}

	if req.WithTokenDApp {
		if err = tokenDApp.Stop(); err != nil {
			h.log.Errorf("Error while stopping token dApp proxy: %v", err)
		} else {
			h.log.Info("Token dApp proxy stopped with success")
		}
	}

	if err = srv.Stop(); err != nil {
		h.log.Errorf("Error while stopping HTTP server: %v", err)
	} else {
		h.log.Info("HTTP server stopped with success")
	}

	return true, nil
}

type GetServiceStateResponse struct {
	URL     string
	Running bool
}

func (h *Handler) GetServiceState() GetServiceStateResponse {
	h.log.Debug("Entering GetServiceState")
	defer h.log.Debug("Leaving GetServiceState")

	return GetServiceStateResponse{
		URL:     h.service.consoleURL,
		Running: h.service.IsRunning(),
	}
}

func (h *Handler) StopService() (bool, error) {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.service.IsRunning() {
		h.log.Error("No service running")
		return false, ErrConsoleNotRunning
	}

	h.log.Info("Shutting down the service")
	h.service.Shutdown()

	return true, nil
}

// waitSignal will wait for a sigterm or sigint interrupt.
func (h *Handler) waitSignal(ctx context.Context, shutdownFunc func()) {
	var gracefulStop = make(chan os.Signal, 1)
	signal.Notify(gracefulStop, syscall.SIGTERM)
	signal.Notify(gracefulStop, syscall.SIGINT)
	signal.Notify(gracefulStop, syscall.SIGQUIT)

	select {
	case sig := <-gracefulStop:
		h.log.Infof("Caught signal %+v", sig)
		shutdownFunc()
	case <-ctx.Done():
		// nothing to do
	}
}

func buildLogger(level string) (*zap.Logger, error) {
	cfg := zap.Config{
		Level:    zap.NewAtomicLevelAt(zapcore.InfoLevel),
		Encoding: "json",
		EncoderConfig: zapcore.EncoderConfig{
			MessageKey:     "message",
			LevelKey:       "level",
			TimeKey:        "@timestamp",
			NameKey:        "logger",
			CallerKey:      "caller",
			StacktraceKey:  "stacktrace",
			LineEnding:     "\n",
			EncodeLevel:    zapcore.LowercaseLevelEncoder,
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
			EncodeName:     zapcore.FullNameEncoder,
		},
		OutputPaths:       []string{"stdout"},
		ErrorOutputPaths:  []string{"stderr"},
		DisableStacktrace: true,
	}

	l, err := getLoggerLevel(level)
	if err != nil {
		return nil, err
	}

	cfg.Level = zap.NewAtomicLevelAt(*l)

	log, err := cfg.Build()
	if err != nil {
		return nil, fmt.Errorf("couldn't create logger: %w", err)
	}
	return log, nil
}

func getLoggerLevel(level string) (*zapcore.Level, error) {
	if !isSupportedLogLevel(level) {
		return nil, errors.New(fmt.Sprintf("unsupported logger level %s", level))
	}

	l := new(zapcore.Level)

	err := l.UnmarshalText([]byte(level))
	if err != nil {
		return nil, fmt.Errorf("couldn't parse logger level: %w", err)
	}

	return l, nil
}

func isSupportedLogLevel(level string) bool {
	for _, supported := range []string{
		zapcore.DebugLevel.String(),
		zapcore.InfoLevel.String(),
		zapcore.WarnLevel.String(),
		zapcore.ErrorLevel.String(),
	} {
		if level == supported {
			return true
		}
	}
	return false
}

func syncLogger(logger *zap.Logger) func() {
	return func() {
		err := logger.Sync()
		if err != nil {
			// Try to report any flushing errors on stderr
			if _, err := fmt.Fprintf(os.Stderr, "couldn't flush logger: %v", err); err != nil {
				// This is the ultimate reporting, as we can't do anything else.
				fmt.Printf("couldn't flush logger: %v", err)
			}
		}
	}
}
