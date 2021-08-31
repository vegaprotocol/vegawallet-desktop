package backend

import (
	"encoding/json"
	"errors"

	"code.vegaprotocol.io/go-wallet/service"
	"code.vegaprotocol.io/go-wallet/wallet"
)

type CreateWalletRequest struct {
	RootPath   string
	Name       string
	Passphrase string
}

type CreateWalletResponse struct {
	Mnemonic   string
	WalletPath string
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

func (s *Service) CreateWallet(data string) (CreateWalletResponse, error) {
	s.log.Debug("Entering CreateWallet")
	defer s.log.Debug("Leaving CreateWallet")

	req := &CreateWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return CreateWalletResponse{}, ErrFailedToSaveServiceConfig
	}

	err = req.Check()
	if err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return CreateWalletResponse{}, err
	}

	config, err := s.loadConfig()
	if err != nil {
		return CreateWalletResponse{}, err
	}

	if len(req.RootPath) == 0 {
		config.WalletRootPath = defaultVegaDir
	} else {
		config.WalletRootPath = req.RootPath
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return CreateWalletResponse{}, err
	}

	err = wStore.Initialise()
	if err != nil {
		s.log.Errorf("Couldn't initialise the wallets store: %v", err)
		return CreateWalletResponse{}, err
	}

	svcStore, err := s.getServiceStore(config)
	if err != nil {
		return CreateWalletResponse{}, err
	}

	exists, err := service.ConfigExists(svcStore)
	if err != nil {
		s.log.Errorf("Couldn't verify service configuration existance: %v", err)
		return CreateWalletResponse{}, err
	}
	if !exists {
		err := service.GenerateConfig(svcStore, false)
		if err != nil {
			s.log.Errorf("Couldn't generate service configuration: %v", err)
			return CreateWalletResponse{}, err
		}
	}

	handler := wallet.NewHandler(wStore)

	mnemonic, err := handler.CreateWallet(req.Name, req.Passphrase)
	if err != nil {
		s.log.Errorf("Couldn't create the wallet: %v", err)
		return CreateWalletResponse{}, err
	}

	err = SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save configuration: %v", err)
		return CreateWalletResponse{}, err
	}

	s.isAppInitialised = true

	return CreateWalletResponse{
		Mnemonic: mnemonic,
	}, nil
}
