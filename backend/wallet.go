package backend

import (
	"encoding/json"
	"errors"
	"fmt"

	"code.vegaprotocol.io/vegawallet/wallet"
	"code.vegaprotocol.io/vegawallet/wallets"
)

type CreateWalletRequest struct {
	VegaHome   string
	Name       string
	Passphrase string
}

func (r CreateWalletRequest) Check() error {
	if len(r.Name) == 0 {
		return errors.New("name is required")
	}

	if len(r.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	return nil
}

type CreateWalletResponse struct {
	Mnemonic   string
	WalletPath string
}

func (s *Handler) CreateWallet(data string) (CreateWalletResponse, error) {
	s.log.Debug("Entering CreateWallet")
	defer s.log.Debug("Leaving CreateWallet")

	req := &CreateWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err = req.Check(); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("request is invalid: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return CreateWalletResponse{}, err
	}

	config.VegaHome = req.VegaHome

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return CreateWalletResponse{}, err
	}

	handler := wallets.NewHandler(wStore)

	mnemonic, err := handler.CreateWallet(req.Name, req.Passphrase)
	if err != nil {
		s.log.Errorf("Couldn't create the wallet: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't create the wallet: %w", err)
	}

	return CreateWalletResponse{
		Mnemonic:   mnemonic,
		WalletPath: wStore.GetWalletPath(req.Name),
	}, nil
}

type ImportWalletRequest struct {
	VegaHome   string
	Name       string
	Mnemonic   string
	Passphrase string
	Version    uint32
}

func (r ImportWalletRequest) Check() error {
	if len(r.Name) == 0 {
		return errors.New("name is required")
	}

	if len(r.Mnemonic) == 0 {
		return errors.New("mnemonic is required")
	}

	if len(r.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	return nil
}

type ImportWalletResponse struct {
	WalletPath string
}

func (s *Handler) ImportWallet(data string) (ImportWalletResponse, error) {
	s.log.Debug("Entering ImportWallet")
	defer s.log.Debug("Leaving ImportWallet")

	req := &ImportWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return ImportWalletResponse{}, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err = req.Check(); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return ImportWalletResponse{}, fmt.Errorf("request is invalid: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return ImportWalletResponse{}, err
	}

	config.VegaHome = req.VegaHome

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return ImportWalletResponse{}, err
	}

	handler := wallets.NewHandler(wStore)

	err = handler.ImportWallet(req.Name, req.Passphrase, req.Mnemonic, req.Version)
	if err != nil {
		s.log.Errorf("Couldn't import the wallet: %v", err)
		return ImportWalletResponse{}, err
	}

	return ImportWalletResponse{
		WalletPath: wStore.GetWalletPath(req.Name),
	}, nil
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
