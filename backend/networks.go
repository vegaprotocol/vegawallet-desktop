package backend

import (
	"errors"
	"fmt"

	"code.vegaprotocol.io/shared/paths"
	"code.vegaprotocol.io/vegawallet/network"
	netstore "code.vegaprotocol.io/vegawallet/network/store/v1"
	"go.uber.org/zap"
)

var DefaultNetworks = []DefaultNetwork{
	{
		Name: "mainnet1",
		URL:  "https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml",
	},
}

type DefaultNetwork struct {
	Name string
	URL  string
}

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

	net, err := getNetwork(st, name)
	if err != nil {
		return nil, err
	}

	return net, nil
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

	networks, err := network.ListNetworks(st)

	compatibleNetworks := []string{}
	for _, net := range networks.Networks {
		versionedFile := struct {
			FileVersion uint32
		}{}
		if err := paths.ReadStructuredFile(st.GetNetworkPath(net), &versionedFile); err != nil {
			continue
		}

		if versionedFile.FileVersion > 1 {
			h.log.Info("Ignoring network with unsupported file version", zap.String("network", net), zap.Uint32("file-version", versionedFile.FileVersion))
			continue
		}

		compatibleNetworks = append(compatibleNetworks, net)
	}

	return &network.ListNetworksResponse{
		Networks: compatibleNetworks,
	}, err
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

func getNetwork(st *netstore.Store, name string) (*network.Network, error) {
	versionedFile := struct {
		FileVersion uint32
	}{}
	if err := paths.ReadStructuredFile(st.GetNetworkPath(name), &versionedFile); err != nil {
		return nil, fmt.Errorf("couldn't figure out the file version of the network configuration file %q: %w", name, err)
	}

	net := &network.Network{}
	if versionedFile.FileVersion > 1 {
		return nil, fmt.Errorf("the format of the network configuration %q is not compatible with this software: expecting version 1, got %d", name, versionedFile.FileVersion)
	} else {
		if err := paths.ReadStructuredFile(st.GetNetworkPath(name), &net); err != nil {
			return nil, fmt.Errorf("couldn't read network configuration file %q: %w", name, err)
		}
	}

	net.Name = name
	return net, nil
}
