package backend

import (
	"encoding/json"
	"fmt"

	"code.vegaprotocol.io/vegawallet/wallet"
)

func (s *Handler) GenerateKey(data string) (*wallet.GenerateKeyResponse, error) {
	s.log.Debug("Entering GenerateKey")
	defer s.log.Debug("Leaving GenerateKey")

	req := &wallet.GenerateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.GenerateKey(wStore, req)
}

func (s *Handler) AnnotateKey(data string) error {
	s.log.Debug("Entering AnnotateKey")
	defer s.log.Debug("Leaving AnnotateKey")

	req := &wallet.AnnotateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.AnnotateKey(wStore, req)
}

func (s *Handler) DescribeKey(data string) (*wallet.DescribeKeyResponse, error) {
	s.log.Debug("Entering DescribeKey")
	defer s.log.Debug("Leaving DescribeKey")

	req := &wallet.DescribeKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.DescribeKey(wStore, req)
}

func (s *Handler) IsolateKey(data string) (*wallet.IsolateKeyResponse, error) {
	s.log.Debug("Entering IsolateKey")
	defer s.log.Debug("Leaving IsolateKey")

	req := &wallet.IsolateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.IsolateKey(wStore, req)
}

func (s *Handler) ListKeys(data string) (*wallet.ListKeysResponse, error) {
	s.log.Debug("Entering ListKeys")
	defer s.log.Debug("Leaving ListKeys")

	req := &wallet.ListKeysRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ListKeys(wStore, req)
}

func (s *Handler) TaintKey(data string) error {
	s.log.Debug("Entering TaintKey")
	defer s.log.Debug("Leaving TaintKey")

	req := &wallet.TaintKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.TaintKey(wStore, req)
}

func (s *Handler) UntaintKey(data string) error {
	s.log.Debug("Entering UntaintKey")
	defer s.log.Debug("Leaving UntaintKey")

	req := &wallet.UntaintKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.UntaintKey(wStore, req)
}
