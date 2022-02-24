package backend

import (
	"errors"
	"fmt"
	"net/http"
	"os"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet/network"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	"code.vegaprotocol.io/vegawallet/node"
	"code.vegaprotocol.io/vegawallet/service"
	svcstore "code.vegaprotocol.io/vegawallet/service/store/v1"
	"code.vegaprotocol.io/vegawallet/wallets"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type serviceState struct {
	url          string
	shutdownFunc func()
}

func (s *serviceState) IsRunning() bool {
	return s.shutdownFunc != nil
}

func (s *serviceState) Shutdown() {
	s.shutdownFunc()
}

func (s *serviceState) Reset() {
	s.shutdownFunc = nil
	s.url = ""
}

type StartServiceRequest struct {
	Network string `json:"network"`
}

func (r StartServiceRequest) Check() error {
	if len(r.Network) == 0 {
		return errors.New("network is required")
	}

	return nil
}

func (h *Handler) StartService(req *StartServiceRequest) (bool, error) {
	h.log.Debug("Entering StartService")
	defer h.log.Debug("Leaving StartService")

	if h.service.IsRunning() {
		h.log.Error("The service is already running")
		return false, ErrServiceAlreadyRunning
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
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	exists, err := netStore.NetworkExists(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't verify the network existence: %v", err))
		return false, fmt.Errorf("couldn't verify the network existence: %w", err)
	}
	if !exists {
		h.log.Error(fmt.Sprintf("Network %s does not exist", req.Network))
		return false, network.NewNetworkDoesNotExistError(req.Network)
	}

	cfg, err := netStore.GetNetwork(req.Network)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise network store: %v", err))
		return false, fmt.Errorf("couldn't initialise network store: %w", err)
	}

	logLevel := cfg.Level.String()
	log, err := buildLogger(logLevel)
	if err != nil {
		return false, err
	}
	defer syncLogger(log)

	svcStore, err := svcstore.InitialiseStore(paths.New(config.VegaHome))
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise service store: %v", err))
		return false, fmt.Errorf("couldn't initialise service store: %w", err)
	}

	isInit, err := service.IsInitialised(svcStore)
	if err != nil {
		return false, fmt.Errorf("couldn't verify service initialisation state: %w", err)
	}

	if !isInit {
		if err = service.InitialiseService(svcStore, false); err != nil {
			return false, fmt.Errorf("couldn't initialise the service: %w", err)
		}
	}

	auth, err := service.NewAuth(log.Named("auth"), svcStore, cfg.TokenExpiry.Get())
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise authentication: %v", err))
		return false, fmt.Errorf("couldn't initialise authentication: %w", err)
	}

	forwarder, err := node.NewForwarder(log.Named("forwarder"), cfg.API.GRPC)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the node forwarder: %v", err))
		return false, fmt.Errorf("couldn't initialise the node forwarder: %w", err)
	}

	srv, err := service.NewService(log.Named("service"), cfg, handler, auth, forwarder)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the service: %v", err))
		return false, err
	}

	h.service.url = fmt.Sprintf("%s:%v", cfg.Host, cfg.Port)
	h.service.shutdownFunc = func() {
		if err := srv.Stop(); err != nil {
			h.log.Error(fmt.Sprintf("Couldn't stop the service: %v", err))
		}
	}

	go func() {
		h.log.Info("Starting the service")
		if err := srv.Start(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			h.log.Error(fmt.Sprintf("Error while starting HTTP server: %v", err))
			h.service.Reset()
			h.log.Info("Service state has been reset")
		}
	}()

	return true, nil
}

type GetServiceStateResponse struct {
	URL     string `json:"url"`
	Running bool   `json:"running"`
}

func (h *Handler) GetServiceState() GetServiceStateResponse {
	h.log.Debug("Entering GetServiceState")
	defer h.log.Debug("Leaving GetServiceState")

	return GetServiceStateResponse{
		URL:     h.service.url,
		Running: h.service.IsRunning(),
	}
}

func (h *Handler) StopService() (bool, error) {
	h.log.Debug("Entering StopService")
	defer h.log.Debug("Leaving StopService")

	if !h.service.IsRunning() {
		h.log.Error("No service running")
		return false, ErrServiceNotRunning
	}

	h.log.Info("Shutting down the service")
	h.service.Shutdown()
	h.service.Reset()

	return true, nil
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
		return nil, fmt.Errorf("unsupported logger level %s", level)
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
