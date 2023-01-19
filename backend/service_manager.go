package backend

import (
	"sync/atomic"

	vgclose "code.vegaprotocol.io/vega/libs/close"
	"code.vegaprotocol.io/vega/wallet/api/interactor"
)

type runningServiceManager struct {
	url string

	closer *vgclose.Closer

	latestHealthState HealthCheckStatus

	logFilePath string

	receptionChan chan interactor.Interaction
	responseChan  chan interactor.Interaction

	isRunning atomic.Bool
}

func newServiceManager() *runningServiceManager {
	s := &runningServiceManager{}
	s.reset()
	return s
}

func (s *runningServiceManager) IsServiceRunning() bool {
	return s.isRunning.Load()
}

func (s *runningServiceManager) SetAsRunning() {
	s.isRunning.Store(true)
}

func (s *runningServiceManager) ServiceHealth() HealthCheckStatus {
	return s.latestHealthState
}

func (s *runningServiceManager) SetHealth(state HealthCheckStatus) {
	s.latestHealthState = state
}

func (s *runningServiceManager) SetLogPath(logFilePath string) {
	s.logFilePath = logFilePath
}

func (s *runningServiceManager) SetURL(url string) {
	s.url = url
}

func (s *runningServiceManager) OnShutdown(callbackFn func()) {
	s.closer.Add(callbackFn)
}

func (s *runningServiceManager) ShutdownService() {
	s.isRunning.Store(false)

	s.closer.CloseAll()

	s.reset()
}

func (s *runningServiceManager) reset() {
	s.url = ""
	s.logFilePath = ""
	s.latestHealthState = UnknownStatus
	s.closer = vgclose.NewCloser()
	s.receptionChan = nil
	s.isRunning.Store(false)
}
