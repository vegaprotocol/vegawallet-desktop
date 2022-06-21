package backend

import (
	"errors"
	"fmt"

	"code.vegaprotocol.io/vegawallet/network"
)

func (h *Handler) ImportNetwork(req *network.ImportNetworkFromSourceRequest) (*network.ImportNetworkFromSourceResponse, error) {
	h.log.Debug("Entering ImportNetwork")
	defer h.log.Debug("Leaving ImportNetwork")

	c, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := h.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	return network.ImportNetworkFromSource(st, network.NewReaders(), req)
}

func (h *Handler) GetNetworkConfig(name string) (*network.Network, error) {
	h.log.Debug("Entering GetNetworkConfig")
	defer h.log.Debug("Leaving GetNetworkConfig")

	if len(name) == 0 {
		return nil, errors.New("network name is required")
	}

	c, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := h.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	cfg, err := st.GetNetwork(name)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't retrieve the service configuration: %v", err))
		return nil, fmt.Errorf("couldn't retrieve the service configuration: %w", err)
	}

	return cfg, nil
}

func (h *Handler) ListNetworks() (*network.ListNetworksResponse, error) {
	h.log.Debug("Entering ListNetworks")
	defer h.log.Debug("Leaving ListNetworks")

	c, err := h.loadAppConfig()
	if err != nil {
		return nil, err
	}

	st, err := h.getNetworksStore(c)
	if err != nil {
		return nil, err
	}

	return network.ListNetworks(st)
}

func (h *Handler) SaveNetworkConfig(cfg *network.Network) (bool, error) {
	h.log.Debug("Entering SaveNetworkConfig")
	defer h.log.Debug("Leaving SaveNetworkConfig")

	c, err := h.loadAppConfig()
	if err != nil {
		return false, err
	}

	st, err := h.getNetworksStore(c)
	if err != nil {
		return false, err
	}

	err = st.SaveNetwork(cfg)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't save the network configuration: %v", err))
		return false, fmt.Errorf("couldn't save the network configuration: %w", err)
	}

	return true, nil
}
