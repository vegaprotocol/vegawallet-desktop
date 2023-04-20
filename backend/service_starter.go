package backend

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	vgclose "code.vegaprotocol.io/vega/libs/close"
	vgjob "code.vegaprotocol.io/vega/libs/job"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	"code.vegaprotocol.io/vega/wallet/service"
	svcStoreV1 "code.vegaprotocol.io/vega/wallet/service/store/v1"
	serviceV1 "code.vegaprotocol.io/vega/wallet/service/v1"
	"code.vegaprotocol.io/vega/wallet/service/v2/connections"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/os/notification"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

type ServiceStarter struct {
	serviceStarter *service.Starter

	closer *vgclose.Closer

	url string

	latestHealthState HealthCheckStatus

	logFilePath string

	receptionChan chan interactor.Interaction
	responseChan  chan interactor.Interaction

	isRunning atomic.Bool

	mu        sync.Mutex
	log       *zap.Logger
	jobRunner *vgjob.Runner
}

func (s *ServiceStarter) StartService(ctx context.Context, network string) (err error) {
	if s.isRunning.Load() {
		s.log.Error("The service is already running")
		return ErrServiceAlreadyRunning
	}
	s.isRunning.Store(true)

	s.jobRunner = vgjob.NewRunner(ctx)

	defer func() {
		if err != nil {
			s.isRunning.Store(false)
			s.jobRunner.StopAllJobs()
			s.jobRunner = nil
			s.log.Info("The service state has been reset")
		}
	}()

	svcURL, errChan, err := s.serviceStarter.Start(s.jobRunner, network, true, 0)
	if err != nil {
		s.log.Error("Failed to start HTTP server", zap.Error(err))
		return err
	}
	s.url = svcURL

	s.log.Info("Starting HTTP service", zap.String("url", svcURL))

	s.jobRunner.Go(func(jobCtx context.Context) {
		s.listenToServiceRuntimeError(jobCtx, errChan)
	})

	s.jobRunner.Go(func(jobCtx context.Context) {
		s.listenToIncomingInteractions(jobCtx)
	})

	// We warn the front-end by sending events when the service is unhealthy.
	// This is done so the front-end doesn't have to do it.
	s.jobRunner.Go(func(jobCtx context.Context) {
		s.monitorServiceHealth(jobCtx, svcURL)
	})

	return nil
}

func (s *ServiceStarter) StopService() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.isRunning.Load() {
		s.jobRunner.StopAllJobs()
		s.isRunning.Store(false)
	}
}

func (s *ServiceStarter) Close() {
	if s.isRunning.Load() {
		s.jobRunner.StopAllJobs()
	}
	s.closer.CloseAll()
	s.reset()
}

func (s *ServiceStarter) Info() GetCurrentServiceInfo {
	if !s.isRunning.Load() {
		return GetCurrentServiceInfo{
			IsRunning: false,
		}
	}

	return GetCurrentServiceInfo{
		URL:               s.url,
		LogFilePath:       s.logFilePath,
		IsRunning:         true,
		LatestHealthState: string(s.latestHealthState),
	}
}

func (s *ServiceStarter) IsServiceRunning() bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.isRunning.Load()
}

func (s *ServiceStarter) ServiceHealth() HealthCheckStatus {
	return s.latestHealthState
}

func (s *ServiceStarter) listenToIncomingInteractions(ctx context.Context) {
	log := s.log.Named("service-interactions-listener")
	log.Info("Listening to incoming interactions")
	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the listening to incoming interactions")
			return
		case interaction, ok := <-s.receptionChan:
			if !ok {
				return
			}
			s.emitReceivedInteraction(ctx, log, interaction)
		}
	}
}

func (s *ServiceStarter) emitReceivedInteraction(ctx context.Context, log *zap.Logger, interaction interactor.Interaction) {
	log.Debug("Received a new interaction",
		zap.String("interaction", string(interaction.Name)),
		zap.String("trace-id", interaction.TraceID),
	)

	if shouldEmitOSNotification(interaction.Name) {
		message := strings.ToLower(strings.ReplaceAll(string(interaction.Name), "_", " "))
		message = strings.ToUpper(message[:1]) + message[1:]
		if err := notification.Notify(app.Name, message); err != nil {
			log.Warn("Could not send the OS notification", zap.Error(err))
		}
	}

	if shouldBringAppToFront(interaction.Name) {
		runtime.WindowShow(ctx)
	}

	runtime.EventsEmit(ctx, NewInteractionEvent, interaction)
}

func (s *ServiceStarter) listenToServiceRuntimeError(jobCtx context.Context, errChan <-chan error) {
	log := s.log.Named("service-runtime-error-listener")
	log.Info("Listening to service runtime error")

	for {
		select {
		case <-jobCtx.Done():
			log.Info("Stopping the listening to the service runtime error")
			return
		case err, ok := <-errChan:
			if !ok {
				return
			}
			s.log.Error("An error occurred while running the service", zap.Error(err))
			s.StopService()
			runtime.EventsEmit(jobCtx, ServiceStoppedWithError, struct {
				Error error
			}{
				Error: err,
			})
		}
	}
}

func (s *ServiceStarter) monitorServiceHealth(ctx context.Context, svcURL string) {
	// We wait a little before starting the monitoring, so the service has
	// time to start, and we avoid to emit erroneous events.
	time.Sleep(serviceHealthMonitoringDelayedStart)

	log := s.log.Named("service-health-monitoring")

	log.Info("Starting the service health monitoring",
		zap.String("host", svcURL),
		zap.Duration("interval", serviceHealthMonitoringInterval),
	)

	// We query the service health once before moving to the ticker, otherwise
	// we have to wait for delayedStart + monitoringInterval.
	s.queryServiceHealth(ctx, log, svcURL)

	ticker := time.NewTicker(serviceHealthMonitoringInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Info("Stopping the service health monitoring")
			return
		case <-ticker.C:
			s.queryServiceHealth(ctx, log, svcURL)
		}
	}
}

func (s *ServiceStarter) queryServiceHealth(ctx context.Context, log *zap.Logger, svcURL string) {
	url := svcURL + "/api/v2/health"
	log.Debug("Checking the service health", zap.String("url", url))
	response, err := http.Get(url)
	if err != nil {
		log.Error("Could not reach the service", zap.Error(err))
		s.latestHealthState = ServiceUnreachable
	} else if response != nil && response.StatusCode == http.StatusOK {
		log.Debug("The service is healthy")
		s.latestHealthState = ServiceIsHealthy
	} else {
		log.Warn("The service is reachable but is not healthy", zap.String("code", response.Status))
		s.latestHealthState = ServiceIsUnhealthy
	}
	runtime.EventsEmit(ctx, string(s.latestHealthState))
}

func (s *ServiceStarter) reset() {
	s.url = ""
	s.logFilePath = ""
	s.latestHealthState = UnknownStatus
	s.closer = vgclose.NewCloser()
	s.receptionChan = nil
	s.responseChan = nil
	s.jobRunner = nil
	s.isRunning.Store(false)
}

func NewServiceStarter(vegaPaths paths.Paths, log *zap.Logger, svcStore *svcStoreV1.Store, walletStore walletapi.WalletStore, netStore walletapi.NetworkStore, connectionsManager *connections.Manager) (*ServiceStarter, error) {
	s := &ServiceStarter{}
	s.reset()
	s.log = log

	loggerBuilderFunc := func(levelName string) (*zap.Logger, zap.AtomicLevel, error) {
		svcLog, svcLogPath, level, err := buildServiceLogger(vegaPaths, paths.WalletServiceLogsHome, levelName)
		if err != nil {
			return nil, zap.AtomicLevel{}, err
		}
		s.logFilePath = svcLogPath
		return svcLog, level, nil
	}

	policyBuilderFunc := func(_ context.Context) serviceV1.Policy {
		return &unsupportedV1APIPolicy{}
	}

	interactorBuilderFunc := func(ctx context.Context) walletapi.Interactor {
		receptionChan := make(chan interactor.Interaction, 100)
		responseChan := make(chan interactor.Interaction, 100)
		s.receptionChan = receptionChan
		s.responseChan = responseChan

		s.closer.Add(func() {
			close(receptionChan)
			close(responseChan)
		})

		return interactor.NewSequentialInteractor(ctx, receptionChan, responseChan)
	}

	serviceStarter := service.NewStarter(
		walletStore,
		netStore,
		svcStore,
		connectionsManager,
		policyBuilderFunc,
		interactorBuilderFunc,
		loggerBuilderFunc,
	)

	s.serviceStarter = serviceStarter

	return s, nil
}

func buildServiceLogger(vegaPaths paths.Paths, logDir paths.StatePath, logLevel string) (*zap.Logger, string, zap.AtomicLevel, error) {
	loggerConfig := vgzap.DefaultConfig()
	loggerConfig = vgzap.WithFileOutputForDedicatedProcess(loggerConfig, vegaPaths.StatePathFor(logDir))
	logFilePath := loggerConfig.OutputPaths[0]
	loggerConfig = vgzap.WithJSONFormat(loggerConfig)
	loggerConfig = vgzap.WithLevel(loggerConfig, logLevel)

	level := loggerConfig.Level

	logger, err := vgzap.Build(loggerConfig)
	if err != nil {
		return nil, "", zap.AtomicLevel{}, fmt.Errorf("could not setup the logger: %w", err)
	}

	return logger, logFilePath, level, nil
}

func shouldBringAppToFront(interactionName interactor.InteractionName) bool {
	return interactionName == interactor.RequestPassphraseName ||
		interactionName == interactor.RequestTransactionReviewForSigningName ||
		interactionName == interactor.RequestTransactionReviewForSendingName ||
		interactionName == interactor.RequestPermissionsReviewName ||
		interactionName == interactor.RequestWalletConnectionReviewName ||
		interactionName == interactor.RequestWalletSelectionName
}

func shouldEmitOSNotification(interactionName interactor.InteractionName) bool {
	return !(interactionName == interactor.LogName ||
		interactionName == interactor.InteractionSessionBeganName ||
		interactionName == interactor.InteractionSessionEndedName)
}
