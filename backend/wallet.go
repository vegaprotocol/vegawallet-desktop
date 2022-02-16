package backend

import (
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

func (h *Handler) CreateWallet(req *wallet.CreateWalletRequest) (*wallet.CreateWalletResponse, error) {
	h.log.Debug("Entering CreateWallet")
	defer h.log.Debug("Leaving CreateWallet")

	if err := CheckCreateWalletRequest(req); err != nil {
		h.log.Error(fmt.Sprintf("Request is invalid: %v", err))
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

func (h *Handler) ImportWallet(req *wallet.ImportWalletRequest) (*wallet.ImportWalletResponse, error) {
	h.log.Debug("Entering ImportWallet")
	defer h.log.Debug("Leaving ImportWallet")

	if err := CheckImportWalletRequest(req); err != nil {
		h.log.Error(fmt.Sprintf("Request is invalid: %v", err))
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

func CheckSignMessageRequest(req *wallet.SignMessageRequest) error {
	if len(req.Wallet) == 0 {
		return errors.New("wallet is required")
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
