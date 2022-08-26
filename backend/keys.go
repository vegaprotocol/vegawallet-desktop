package backend

import (
	"code.vegaprotocol.io/vega/wallet/wallet"
)

func (h *Handler) GenerateKey(req *wallet.GenerateKeyRequest) (*wallet.GenerateKeyResponse, error) {
	h.log.Debug("Entering GenerateKey")
	defer h.log.Debug("Leaving GenerateKey")

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

func (h *Handler) AnnotateKey(req *wallet.AnnotateKeyRequest) error {
	h.log.Debug("Entering AnnotateKey")
	defer h.log.Debug("Leaving AnnotateKey")

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

func (h *Handler) DescribeKey(req *wallet.DescribeKeyRequest) (*wallet.DescribeKeyResponse, error) {
	h.log.Debug("Entering DescribeKey")
	defer h.log.Debug("Leaving DescribeKey")

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

func (h *Handler) IsolateKey(req *wallet.IsolateKeyRequest) (*wallet.IsolateKeyResponse, error) {
	h.log.Debug("Entering IsolateKey")
	defer h.log.Debug("Leaving IsolateKey")

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

func (h *Handler) ListKeys(req *wallet.ListKeysRequest) (*wallet.ListKeysResponse, error) {
	h.log.Debug("Entering ListKeys")
	defer h.log.Debug("Leaving ListKeys")

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

func (h *Handler) TaintKey(req *wallet.TaintKeyRequest) error {
	h.log.Debug("Entering TaintKey")
	defer h.log.Debug("Leaving TaintKey")

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

func (h *Handler) UntaintKey(req *wallet.UntaintKeyRequest) error {
	h.log.Debug("Entering UntaintKey")
	defer h.log.Debug("Leaving UntaintKey")

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
