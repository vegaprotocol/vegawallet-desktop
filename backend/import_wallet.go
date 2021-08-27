package backend

import (
	"encoding/json"
	"errors"

	"code.vegaprotocol.io/go-wallet/service"
	"code.vegaprotocol.io/go-wallet/wallet"
)

type ImportWalletRequest struct {
	RootPath   string
	Name       string
	Mnemonic   string
	Passphrase string
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

func (s *Service) ImportWallet(data string) (bool, error) {
	s.log.Debug("Entering ImportWallet")
	defer s.log.Debug("Leaving ImportWallet")

	req := &ImportWalletRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return false, ErrFailedToSaveServiceConfig
	}

	err = req.Check()
	if err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return false, err
	}

	config, err := s.loadConfig()
	if err != nil {
		return false, err
	}

	if len(req.RootPath) == 0 {
		config.WalletRootPath = defaultVegaDir
	} else {
		config.WalletRootPath = req.RootPath
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return false, err
	}

	err = wStore.Initialise()
	if err != nil {
		s.log.Errorf("Couldn't initialise the wallets store: %v", err)
		return false, err
	}

	handler := wallet.NewHandler(wStore)

	svcStore, err := s.getServiceStore(config)
	if err != nil {
		return false, err
	}

	exists, err := service.ConfigExists(svcStore)
	if err != nil {
		s.log.Errorf("Couldn't verify service configuration existance: %v", err)
		return false, err
	}
	if !exists {
		err := service.GenerateConfig(svcStore, false)
		if err != nil {
			s.log.Errorf("Couldn't generate service configuration: %v", err)
			return false, err
		}
	}

	err = handler.ImportWallet(req.Name, req.Passphrase, req.Mnemonic)
	if err != nil {
		s.log.Errorf("Couldn't import the wallet: %v", err)
		return false, err
	}

	err = SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save configuration: %v", err)
		return false, err
	}

	s.isAppInitialised = true

	return true, nil
}
