package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"path/filepath"
	"strings"
)

type LoadWalletsRequest struct {
	VegaHome string
}

func (r LoadWalletsRequest) Check() error {
	if len(r.VegaHome) > 0 && !strings.HasPrefix(r.VegaHome, "/") {
		return errors.New("vega home should be an absolute path")
	}
	
	return nil
}

type LoadWalletsResponse struct {
	WalletsPath string
}

func (s *Handler) LoadWallets(data string) (LoadWalletsResponse, error) {
	s.log.Debug("Entering LoadWallet")
	defer s.log.Debug("Leaving LoadWallet")

	req := &LoadWalletsRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return LoadWalletsResponse{}, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	if err = req.Check(); err != nil {
		s.log.Errorf("Request is invalid: %v", err)
		return LoadWalletsResponse{}, fmt.Errorf("request is invalid: %w", err)
	}

	config, err := s.loadAppConfig()
	if err != nil {
		return LoadWalletsResponse{}, err
	}

	config.VegaHome = req.VegaHome

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return LoadWalletsResponse{}, err
	}

	wallets, err := wStore.ListWallets()
	if err != nil {
		s.log.Errorf("Couldn't list wallets: %v", err)
		return LoadWalletsResponse{}, err
	}

	if len(wallets) == 0 {
		return LoadWalletsResponse{}, ErrNoWalletFound
	}

	err = s.configLoader.SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save configuration: %v", err)
		return LoadWalletsResponse{}, fmt.Errorf("couldn't save configuration: %w", err)
	}

	s.isAppInitialised = true

	return LoadWalletsResponse{
		WalletsPath: filepath.Dir(wStore.GetWalletPath(wallets[0])),
	}, nil
}
