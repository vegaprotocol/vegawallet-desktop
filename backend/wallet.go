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

func (s *Handler) CreateWallet(data string) (*wallet.CreateWalletResponse, error) {
	s.log.Debug("Entering CreateWallet")
	defer s.log.Debug("Leaving CreateWallet")

	req := &wallet.CreateWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err = CheckCreateWalletRequest(req); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return nil, fmt.Errorf("request is invalid: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
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

func (s *Handler) ImportWallet(data string) (*wallet.ImportWalletResponse, error) {
	s.log.Debug("Entering ImportWallet")
	defer s.log.Debug("Leaving ImportWallet")

	req := &wallet.ImportWalletRequest{}
	if err := json.Unmarshal([]byte(data), req); err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err := CheckImportWalletRequest(req); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return nil, fmt.Errorf("request is invalid: %w", err)
	}
	s.log.Debug(fmt.Sprintf("request 2 %v", req))

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ImportWallet(wStore, req)
}

func (s *Handler) ListWallets() (*wallet.ListWalletsResponse, error) {
	s.log.Debug("Entering ListWallets")
	defer s.log.Debug("Leaving ListWallets")

	config, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return nil, err
	}

	return wallet.ListWallets(wStore)
}
