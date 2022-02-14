package backend

import (
	"encoding/json"
	"errors"
	"fmt"

	"code.vegaprotocol.io/vegawallet/wallet"
)

func CheckCreateWalletRequest(req *wallet.CreateWalletRequest) error {
	if len(req.Wallet) == 0 {
		return errors.New("name is required")
	}

	if len(req.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	return nil
}

func (h *Handler) CreateWallet(data string) (*wallet.CreateWalletResponse, error) {
	h.log.Debug("Entering CreateWallet")
	defer h.log.Debug("Leaving CreateWallet")

	req := &wallet.CreateWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err = CheckCreateWalletRequest(req); err != nil {
		h.log.Errorf("Request is invalid: %v", err)
		return nil, fmt.Errorf("request is invalid: %w", err)
	}

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.CreateWallet(wStore, req)
}

func CheckImportWalletRequest(req *wallet.ImportWalletRequest) error {
	if len(req.Wallet) == 0 {
		return errors.New("name is required")
	}

	if len(req.RecoveryPhrase) == 0 {
		return errors.New("recovery phrase is required")
	}

	if len(req.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	return nil
}

type ImportWalletResponse struct {
	WalletPath string
}

func (h *Handler) ImportWallet(data string) (*wallet.ImportWalletResponse, error) {
	h.log.Debug("Entering ImportWallet")
	defer h.log.Debug("Leaving ImportWallet")

	req := &wallet.ImportWalletRequest{}
	if err := json.Unmarshal([]byte(data), req); err != nil {
		h.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err := CheckImportWalletRequest(req); err != nil {
		h.log.Errorf("Request is invalid: %v", err)
		return nil, fmt.Errorf("request is invalid: %w", err)
	}
	h.log.Debug(fmt.Sprintf("request 2 %v", req))

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ImportWallet(wStore, req)
}

func (h *Handler) ListWallets() (*wallet.ListWalletsResponse, error) {
	h.log.Debug("Entering ListWallets")
	defer h.log.Debug("Leaving ListWallets")

	config, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := h.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ListWallets(wStore)
}
