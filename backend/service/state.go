package service

import (
	"context"

	"code.vegaprotocol.io/vega/wallet/service"
)

type State struct {
	url string

	cancelFunc context.CancelFunc

	ConsentRequestsChan  chan service.ConsentRequest
	SentTransactionsChan chan service.SentTransaction

	ConsentRequests  *ConsentRequests
	SentTransactions *SentTransactions
}

func NewState() *State {
	s := &State{}
	s.Reset()
	return s
}

func (s *State) Set(url string, cancelFunc context.CancelFunc) {
	s.url = url
	s.cancelFunc = cancelFunc
}

func (s *State) URL() string {
	return s.url
}

func (s *State) IsRunning() bool {
	return s.cancelFunc != nil
}

func (s *State) Shutdown() {
	s.cancelFunc()

	close(s.ConsentRequestsChan)
	close(s.SentTransactionsChan)
}

func (s *State) Reset() {
	s.url = ""
	s.cancelFunc = nil
	s.ConsentRequests = NewConsentRequests()
	s.SentTransactions = NewSentTransactions()
	s.ConsentRequestsChan = make(chan service.ConsentRequest, 1)
	s.SentTransactionsChan = make(chan service.SentTransaction, 1)
}
