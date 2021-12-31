package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"code.vegaprotocol.io/vegawallet/wallet"
	"code.vegaprotocol.io/vegawallet/wallets"
)

type CreateWalletRequest struct {
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
	RecoveryPhrase string
	WalletPath     string
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

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return CreateWalletResponse{}, err
	}

	handler := wallets.NewHandler(wStore)

	recoveryPhrase, err := handler.CreateWallet(req.Name, req.Passphrase)
	if err != nil {
		s.log.Errorf("Couldn't create the wallet: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't create the wallet: %w", err)
	}

	return CreateWalletResponse{
		RecoveryPhrase: recoveryPhrase,
		WalletPath:     wStore.GetWalletPath(req.Name),
	}, nil
}

type ImportWalletRequest struct {
	Name           string
	RecoveryPhrase string
	Passphrase     string
	Version        string
	parsedVersion  uint32
}

func (r *ImportWalletRequest) Check() error {
	if len(r.Name) == 0 {
		return errors.New("name is required")
	}

	if len(r.RecoveryPhrase) == 0 {
		return errors.New("recovery phrase is required")
	}

	if len(r.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}

	version, err := strconv.ParseUint(r.Version, 10, 32)
	if err != nil {
		return errors.New("version requires a positive integer")
	}
	r.parsedVersion = uint32(version)

	return nil
}

type ImportWalletResponse struct {
	WalletPath string
}

func (s *Handler) ImportWallet(data string) (ImportWalletResponse, error) {
	s.log.Debug("Entering ImportWallet")
	defer s.log.Debug("Leaving ImportWallet")

	req := &ImportWalletRequest{}
	if err := json.Unmarshal([]byte(data), req); err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return ImportWalletResponse{}, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err := req.Check(); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return ImportWalletResponse{}, fmt.Errorf("request is invalid: %w", err)
	}
	s.log.Debug(fmt.Sprintf("request 2 %v", req))

	config, err := s.loadAppConfig()
	if err != nil {
		return ImportWalletResponse{}, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return ImportWalletResponse{}, err
	}

	handler := wallets.NewHandler(wStore)

	if err := handler.ImportWallet(req.Name, req.Passphrase, req.RecoveryPhrase, req.parsedVersion); err != nil {
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
