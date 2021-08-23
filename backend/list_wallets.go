package backend

type ListWalletsResponse struct {
	Wallets []string
}

func (s *Service) ListWallets() (ListWalletsResponse, error) {
	s.log.Debug("Entering ListWallets")
	defer s.log.Debug("Leaving ListWallets")

	config, err := s.loadConfig()
	if err != nil {
		return ListWalletsResponse{}, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return ListWalletsResponse{}, err
	}

	wallets, err := wStore.ListWallets()
	if err != nil {
		s.log.Errorf("Couldn't list wallets: %v", err)
		return ListWalletsResponse{}, err
	}

	return ListWalletsResponse{
		Wallets: wallets,
	}, nil
}
