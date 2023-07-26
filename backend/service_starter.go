package backend

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	vgjob "code.vegaprotocol.io/vega/libs/job"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"code.vegaprotocol.io/vega/paths"
	walletapi "code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
	"code.vegaprotocol.io/vega/wallet/service"
	svcStoreV1 "code.vegaprotocol.io/vega/wallet/service/store/v1"
	"code.vegaprotocol.io/vega/wallet/service/v2/connections"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/os/notification"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

var ErrNoChanResponseForTraceID = errors.New("no response expected for that traceID")

type ServiceStarter struct {
	serviceStarter *service.Starter

	url string

	latestHealthState HealthCheckStatus

	logFilePath string

	receptionChan <-chan interactor.Interaction

	isRunning atomic.Bool

	mu        sync.Mutex
	log       *zap.Logger
	jobRunner *vgjob.Runner

	responseChansByTraceID map[string]chan<- interactor.Interaction
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

	rc, err := s.serviceStarter.Start(s.jobRunner, network, true)
	if err != nil {
		s.log.Error("Failed to start HTTP server", zap.Error(err))
		return err
	}
	s.url = rc.ServiceURL

	s.log.Info("Starting HTTP service", zap.String("url", rc.ServiceURL))

	s.jobRunner.Go(func(jobCtx context.Context) {
		s.listenToServiceRuntimeError(jobCtx, rc.ErrCh)
	})

	s.jobRunner.Go(func(jobCtx context.Context) {
		s.listenToIncomingInteractions(jobCtx)
	})

	// We warn the front-end by sending events when the service is unhealthy.
	// This is done so the front-end doesn't have to do it.
	s.jobRunner.Go(func(jobCtx context.Context) {
		s.monitorServiceHealth(jobCtx, rc.ServiceURL)
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

	// Since the reception channel is not re-created on every service restart,
	// we need to purge it to avoid leaving interaction a the previous session
	// be treated as from the newer session.
	defer func() {
		log.Info("Purging interactions left-over")
		defer log.Info("Left-over interactions purged")
		for {
			select {
			case interaction, ok := <-s.receptionChan:
				if !ok {
					return
				}
				log.Debug("Purged interaction", zap.String("name", string(interaction.Name)))
			default:
				return
			}
		}
	}()

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

	switch data := interaction.Data.(type) {
	case interactor.RequestTransactionReviewForSigning:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestTransactionReviewForSending:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestPermissionsReview:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestPassphrase:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestWalletSelection:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestWalletConnectionReview:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	case interactor.RequestTransactionReviewForChecking:
		s.responseChansByTraceID[interaction.TraceID] = data.ResponseCh
	}

	runtime.EventsEmit(ctx, NewInteractionEvent, interaction)
}

func (s *ServiceStarter) RespondToInteraction(interaction interactor.Interaction) error {
	ch, ok := s.responseChansByTraceID[interaction.TraceID]
	if !ok {
		return ErrNoChanResponseForTraceID
	}

	ch <- interaction

	delete(s.responseChansByTraceID, interaction.TraceID)

	return nil
}

func (s *ServiceStarter) listenToServiceRuntimeError(jobCtx context.Context, errChan <-chan error) {
	log := s.log.Named("service-runtime-error-listener")
	log.Info("Listening to service runtime error")

	select {
	case <-jobCtx.Done():
		break
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

	log.Info("Stopping the listening to the service runtime error")
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
		log.Warn("The service is reachable but is unhealthy", zap.String("code", response.Status))
		s.latestHealthState = ServiceIsUnhealthy
	}
	runtime.EventsEmit(ctx, string(s.latestHealthState))
}

func (s *ServiceStarter) reset() {
	s.url = ""
	s.logFilePath = ""
	s.latestHealthState = UnknownStatus
	s.receptionChan = nil
	s.jobRunner = nil
	s.isRunning.Store(false)
}

func NewServiceStarter(vegaPaths paths.Paths, log *zap.Logger, svcStore *svcStoreV1.Store, walletStore walletapi.WalletStore, netStore walletapi.NetworkStore, connectionsManager *connections.Manager, apiInteractor walletapi.Interactor, receptionChan <-chan interactor.Interaction) (*ServiceStarter, error) {
	s := &ServiceStarter{}
	s.reset()
	s.log = log
	s.receptionChan = receptionChan
	s.responseChansByTraceID = map[string]chan<- interactor.Interaction{}

	loggerBuilderFunc := func(levelName string) (*zap.Logger, zap.AtomicLevel, error) {
		svcLog, svcLogPath, level, err := buildServiceLogger(vegaPaths, paths.WalletServiceLogsHome, levelName)
		if err != nil {
			return nil, zap.AtomicLevel{}, err
		}
		s.logFilePath = svcLogPath
		return svcLog, level, nil
	}

	policy := &unsupportedV1APIPolicy{}

	serviceStarter := service.NewStarter(
		walletStore,
		netStore,
		svcStore,
		connectionsManager,
		policy,
		apiInteractor,
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
