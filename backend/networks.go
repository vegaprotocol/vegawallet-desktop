package backend

import (
	"encoding/json"
	"errors"
	"fmt"

	"code.vegaprotocol.io/vegawallet/network"
)

func (s *Handler) ImportNetwork(data string) (*network.ImportNetworkFromSourceResponse, error) {
	s.log.Debug("Entering ImportNetwork")
	defer s.log.Debug("Leaving ImportNetwork")

	req := &network.ImportNetworkFromSourceRequest{}
	err := json.Unmarshal([]byte(data), req)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall request: %v", err)
		return nil, fmt.Errorf("couldn't unmarshal request: %w", err)
	}

	c, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := s.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	return network.ImportNetworkFromSource(st, network.NewReaders(), req)
}

func (s *Handler) GetNetworkConfig(name string) (*network.Network, error) {
	s.log.Debug("Entering GetNetworkConfig")
	defer s.log.Debug("Leaving GetNetworkConfig")

	if len(name) == 0 {
		return nil, errors.New("name is required")
	}

	c, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := s.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	cfg, err := st.GetNetwork(name)
	if err != nil {
		s.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return nil, fmt.Errorf("couldn't retrieve the service configuration: %w", err)
	}

	return cfg, nil
}

func (s *Handler) ListNetworks() (*network.ListNetworksResponse, error) {
	s.log.Debug("Entering ListNetworks")
	defer s.log.Debug("Leaving ListNetworks")

	c, err := s.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := s.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	return network.ListNetworks(st)
}

func (s *Handler) SaveNetworkConfig(jsonConfig string) (bool, error) {
	s.log.Debug("Entering SaveNetworkConfig")
	defer s.log.Debug("Leaving SaveNetworkConfig")

	c, err := s.loadAppConfig()
	if err != nil {
		return false, err
	}

	st, err := s.getNetworksStore(c)
	if err != nil {
		return false, err
	}

	cfg := &network.Network{}
	err = json.Unmarshal([]byte(jsonConfig), cfg)
	if err != nil {
		s.log.Errorf("Couldn't unmarshall JSON config: %v", err)
		return false, fmt.Errorf("couldn't unmarshal configuration: %w", err)
	}

	err = st.SaveNetwork(cfg)
	if err != nil {
		s.log.Errorf("Couldn't save the network configuration: %v", err)
		return false, fmt.Errorf("couldn't save the network configuration: %w", err)
	}

	return true, nil
}
