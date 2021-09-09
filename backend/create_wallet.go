package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"code.vegaprotocol.io/go-wallet/service"
	"code.vegaprotocol.io/go-wallet/wallets"
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

	if len(r.VegaHome) > 0 && !strings.HasPrefix(r.VegaHome, "/") {
		return errors.New("vega home should be an absolute path")
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

	err = req.Check()
	if err != nil {
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

	svcStore, err := s.getServiceStore(config)
	if err != nil {
		return CreateWalletResponse{}, err
	}

	exists, err := service.ConfigExists(svcStore)
	if err != nil {
		s.log.Errorf("Couldn't verify service configuration existence: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't verify service configuration existence: %w", err)
	}
	if !exists {
		err := service.GenerateConfig(svcStore, false)
		if err != nil {
			s.log.Errorf("Couldn't generate service configuration: %v", err)
			return CreateWalletResponse{}, fmt.Errorf("couldn't generate service configuration: %w", err)
		}
	}

	handler := wallets.NewHandler(wStore)

	mnemonic, err := handler.CreateWallet(req.Name, req.Passphrase)
	if err != nil {
		s.log.Errorf("Couldn't create the wallet: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't create the wallet: %w", err)
	}

	err = s.configLoader.SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save the configuration: %v", err)
		return CreateWalletResponse{}, fmt.Errorf("couldn't save the configuration: %w", err)
	}

	s.isAppInitialised = true

	return CreateWalletResponse{
		Mnemonic: mnemonic,
		WalletPath: wStore.GetWalletPath(req.Name),
	}, nil
}
