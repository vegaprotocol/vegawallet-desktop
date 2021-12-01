package backend

import "code.vegaprotocol.io/vegawallet/wallet"

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
