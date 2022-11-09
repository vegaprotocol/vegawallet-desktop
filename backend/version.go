package backend

import (
	"context"
	"fmt"
	"time"

	vgversion "code.vegaprotocol.io/vega/libs/version"
	wversion "code.vegaprotocol.io/vega/wallet/version"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/blang/semver/v4"
)

const (
	ReleasesAPI = "https://api.github.com/repos/vegaprotocol/vegawallet-desktop/releases"
	ReleasesURL = "https://github.com/vegaprotocol/vegawallet-desktop/releases"

	requestTimeout = 5 * time.Second
)

var (
	// Hash specifies the git commit used to build the application.
	// See VERSION_HASH in Makefile for details.
	Hash = "unknown"
	// Version specifies the version used to build the application.
	// See VERSION in Makefile for details.
	Version = "v0.3.0"
)

type GetVersionResponse struct {
	Version string                       `json:"version"`
	GitHash string                       `json:"gitHash"`
	Backend *wversion.GetVersionResponse `json:"backend"`
}

type LatestRelease struct {
	Version string `json:"version"`
	URL     string `json:"url"`
}

func (h *Handler) GetLatestRelease() (LatestRelease, error) {
	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	v, err := vgversion.Check(vgversion.BuildGithubReleasesRequestFrom(ctx, ReleasesAPI), app.Version)
	if err != nil {
		return LatestRelease{}, fmt.Errorf("could not check latest releases: %w", err)
	}

	latestRelease := LatestRelease{}
	if v != nil {
		latestRelease.Version = v.String()
		latestRelease.URL = vgversion.GetGithubReleaseURL(ReleasesURL, v)
	} else {
		latestRelease.Version = Version
		version, _ := semver.Parse(Version)
		latestRelease.URL = vgversion.GetGithubReleaseURL(ReleasesURL, &version)
	}

	return latestRelease, nil
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
