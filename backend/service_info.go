package backend

import (
	"context"

	"code.vegaprotocol.io/vega/wallet/api/interactor"
)

type serviceInfo struct {
	url string

	cancelFunc context.CancelFunc

	logFilePath string

	responseChan  chan interactor.Interaction
	receptionChan chan interactor.Interaction
}

func newServiceInfo() *serviceInfo {
	s := &serviceInfo{}
	s.reset()
	return s
}

func (s *serviceInfo) IsRunning() bool {
	return s.cancelFunc != nil
}

func (s *serviceInfo) SetInfo(url string, logFilePath string) {
	s.url = url
	s.logFilePath = logFilePath
}

func (s *serviceInfo) OnShutdown(cancelFunc context.CancelFunc) {
	s.cancelFunc = cancelFunc
}

func (s *serviceInfo) Shutdown() {
	s.cancelFunc()

	close(s.receptionChan)
	close(s.responseChan)

	s.reset()
}

func (s *serviceInfo) reset() {
	s.url = ""
	s.logFilePath = ""
	s.cancelFunc = nil
	s.receptionChan = make(chan interactor.Interaction, 1)
	s.responseChan = make(chan interactor.Interaction, 1)
}
