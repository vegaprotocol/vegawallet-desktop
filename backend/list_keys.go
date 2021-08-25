package backend

import (
	"encoding/json"
	"errors"

	"code.vegaprotocol.io/go-wallet/wallet"
)

type ListKeysRequest struct {
	Name       string
	Passphrase string
}

func (r ListKeysRequest) Check() error {
	if len(r.Name) == 0 {
		return errors.New("name is required")
	}

	if len(r.Passphrase) == 0 {
		return errors.New("passphrase is required")
	}
	return nil
}

type ListKeysResponse struct {
	Name     string
	KeyPairs []KeyPair
}

type KeyPair struct {
	PublicKey        string
	PrivateKey       string
	IsTainted        bool
	Meta             []Meta
	AlgorithmVersion uint32
	AlgorithmName    string
}

type Meta struct {
	Key   string
	Value string
}

func (s *Service) ListKeys(data string) (ListKeysResponse, error) {
	s.log.Debug("Entering ListKeys")
	defer s.log.Debug("Leaving ListKeys")

	req := &ListKeysRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return ListKeysResponse{}, ErrFailedToSaveServiceConfig
	}

	config, err := s.loadConfig()
	if err != nil {
		return ListKeysResponse{}, err
	}

	wStore, err := s.getWalletsStore(config)
	if err != nil {
		return ListKeysResponse{}, err
	}

	w, err := wStore.GetWallet(req.Name, req.Passphrase)
	if err != nil {
		s.log.Errorf("Couldn't get the wallet: %v", err)
		return ListKeysResponse{}, err
	}

	return ListKeysResponse{
		Name:     req.Name,
		KeyPairs: extractKeyPairs(w),
	}, nil
}

func extractKeyPairs(w wallet.Wallet) []KeyPair {
	var keyPairs []KeyPair
	for _, k := range w.ListKeyPairs() {
		var meta []Meta
		for _, m := range k.Meta() {
			meta = append(meta, Meta{
				Key:   m.Key,
				Value: m.Value,
			})
		}
		keyPairs = append(keyPairs, KeyPair{
			PublicKey:        k.PublicKey(),
			PrivateKey:       k.PrivateKey(),
			IsTainted:        k.IsTainted(),
			Meta:             meta,
			AlgorithmVersion: k.AlgorithmVersion(),
			AlgorithmName:    k.AlgorithmName(),
		})
	}
	return keyPairs
}
