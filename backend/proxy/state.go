package proxy

import (
	"context"
)

type State struct {
	url        string
	cancelFunc context.CancelFunc
}

func NewState() *State {
	return &State{}
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
}

func (s *State) Reset() {
	s.url = ""
	s.cancelFunc = nil
}
