package backend

import (
	"fmt"
	"time"

	wversion "code.vegaprotocol.io/vega/wallet/version"
)

const (
	ReleasesAPI        = "https://api.github.com/repos/vegaprotocol/vegawallet-desktop/releases"
	ReleasesURL        = "https://github.com/vegaprotocol/vegawallet-desktop/releases"
	defaultVersionHash = "unknown"
	defaultVersion     = "v0.3.0+dev"
	requestTimeout     = 5 * time.Second
)

var (
	// Hash specifies the git commit used to build the application.
	// See VERSION_HASH in Makefile for details.
	Hash = defaultVersionHash

	// Version specifies the version used to build the application.
	// See VERSION in Makefile for details.
	Version = defaultVersion
)

type GetVersionResponse struct {
	Version string                       `json:"version"`
	GitHash string                       `json:"gitHash"`
	Backend *wversion.GetVersionResponse `json:"backend"`
}

func (h *Handler) GetVersion() (*GetVersionResponse, error) {
	h.log.Debug("Entering GetVersion")
	defer h.log.Debug("Leaving GetVersion")

	cfg, err := h.configLoader.GetConfig()
	if err != nil {
		return nil, fmt.Errorf("could not load the configuration: %w", err)
	}

	netStore, err := h.getNetworksStore(cfg)
	if err != nil {
		return nil, err
	}

	return &GetVersionResponse{
		Version: Version,
		GitHash: Hash,
		Backend: wversion.GetVersionInfo(netStore, wversion.GetNetworkVersionThroughGRPC),
	}, nil
}
