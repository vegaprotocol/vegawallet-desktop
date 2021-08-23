package backend

import (
	"encoding/json"
)

type LoadWalletsRequest struct {
	RootPath string
}

func (s *Service) LoadWallets(data string) (bool, error) {
	s.log.Debug("Entering LoadWallet")
	defer s.log.Debug("Leaving LoadWallet")

	req := &LoadWalletsRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return false, ErrFailedToSaveServiceConfig
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

	wallets, err := wStore.ListWallets()
	if err != nil {
		s.log.Errorf("Couldn't list wallets: %v", err)
		return false, err
	}

	if len(wallets) == 0 {
		return false, ErrNoWalletFound
	}

	err = SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save configuration: %v", err)
		return false, err
	}

	s.isAppInitialised = true

	return true, nil
}
