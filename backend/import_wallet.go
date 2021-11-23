package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"code.vegaprotocol.io/vegawallet/wallets"
)

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

	if len(r.VegaHome) > 0 && !strings.HasPrefix(r.VegaHome, "/") {
		return errors.New("vega home should be an absolute path")
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

	err = s.configLoader.SaveConfig(config)
	if err != nil {
		s.log.Errorf("Couldn't save configuration: %v", err)
		return ImportWalletResponse{}, err
	}

	s.isAppInitialised = true

	return ImportWalletResponse{
		WalletPath: wStore.GetWalletPath(req.Name),
	}, nil
}
