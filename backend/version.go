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

type GetVersionResponse struct {
	Version       string                                       `json:"version"`
	GitHash       string                                       `json:"gitHash"`
	Backend       *wversion.GetSoftwareVersionResponse         `json:"backend"`
	Compatibility *wversion.CheckSoftwareCompatibilityResponse `json:"networksCompatibility"`
}

type LatestRelease struct {
	Version string `json:"version"`
	URL     string `json:"url"`
}

func (h *Handler) GetLatestRelease() (LatestRelease, error) {
	ctx, cancel := context.WithTimeout(h.ctx, requestTimeout)
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
		latestRelease.Version = app.Version
		version, _ := semver.Parse(app.Version)
		latestRelease.URL = vgversion.GetGithubReleaseURL(ReleasesURL, &version)
	}

	return latestRelease, nil
}

func (h *Handler) GetVersion() (*GetVersionResponse, error) {
	if err := h.ensureBackendStarted(); err != nil {
		return nil, err
	}

	h.log.Debug("Entering GetVersion")
	defer h.log.Debug("Leaving GetVersion")

	if err := h.ensureAppIsInitialised(); err != nil {
		return nil, err
	}

	compatibility, _ := wversion.CheckSoftwareCompatibility(h.networkStore, wversion.GetNetworkVersionThroughGRPC)

	return &GetVersionResponse{
		Version:       app.Version,
		GitHash:       app.VersionHash,
		Backend:       wversion.GetSoftwareVersionInfo(),
		Compatibility: compatibility,
	}, nil
}
