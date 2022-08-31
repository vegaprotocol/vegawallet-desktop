package backend

import (
	"errors"

	"code.vegaprotocol.io/vega/wallet/wallet"
)

func CheckSignMessageRequest(req *wallet.SignMessageRequest) error {
	if len(req.Wallet) == 0 {
		return errors.New("wallet name is required")
	}

	if len(req.PubKey) == 0 {
		return errors.New("pubkey is required")
	}

	if len(req.Message) == 0 {
		return errors.New("message is required")
	}

	if len(req.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	return nil
}

func (h *Handler) SignMessage(req *wallet.SignMessageRequest) (*wallet.SignMessageResponse, error) {
	h.log.Debug("Entering SignMessage")
	defer h.log.Debug("Leaving SignMessage")

	err := CheckSignMessageRequest(req)

	if err != nil {
		return nil, err
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.SignMessage(wStore, req)
}
