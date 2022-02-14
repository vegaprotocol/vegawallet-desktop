package backend

import (
	"encoding/json"
	"fmt"

	"code.vegaprotocol.io/vegawallet/wallet"
)

func (h *Handler) GenerateKey(data string) (*wallet.GenerateKeyResponse, error) {
	h.log.Debug("Entering GenerateKey")
	defer h.log.Debug("Leaving GenerateKey")

	req := &wallet.GenerateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.GenerateKey(wStore, req)
}

func (h *Handler) AnnotateKey(data string) error {
	h.log.Debug("Entering AnnotateKey")
	defer h.log.Debug("Leaving AnnotateKey")

	req := &wallet.AnnotateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.AnnotateKey(wStore, req)
}

func (h *Handler) DescribeKey(data string) (*wallet.DescribeKeyResponse, error) {
	h.log.Debug("Entering DescribeKey")
	defer h.log.Debug("Leaving DescribeKey")

	req := &wallet.DescribeKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.DescribeKey(wStore, req)
}

func (h *Handler) IsolateKey(data string) (*wallet.IsolateKeyResponse, error) {
	h.log.Debug("Entering IsolateKey")
	defer h.log.Debug("Leaving IsolateKey")

	req := &wallet.IsolateKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.IsolateKey(wStore, req)
}

func (h *Handler) ListKeys(data string) (*wallet.ListKeysResponse, error) {
	h.log.Debug("Entering ListKeys")
	defer h.log.Debug("Leaving ListKeys")

	req := &wallet.ListKeysRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ListKeys(wStore, req)
}

func (h *Handler) TaintKey(data string) error {
	h.log.Debug("Entering TaintKey")
	defer h.log.Debug("Leaving TaintKey")

	req := &wallet.TaintKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.TaintKey(wStore, req)
}

func (h *Handler) UntaintKey(data string) error {
	h.log.Debug("Entering UntaintKey")
	defer h.log.Debug("Leaving UntaintKey")

	req := &wallet.UntaintKeyRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return err
	}

	return wallet.UntaintKey(wStore, req)
}
