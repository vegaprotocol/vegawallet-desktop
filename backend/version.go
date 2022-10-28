package backend

import (
	"context"
	"fmt"
	"time"

	vgversion "code.vegaprotocol.io/vega/libs/version"
	"code.vegaprotocol.io/vegawallet-desktop/app"
)

const (
	ReleasesAPI = "https://api.github.com/repos/vegaprotocol/vegawallet-desktop/releases"
	ReleasesURL = "https://github.com/vegaprotocol/vegawallet-desktop/releases"

	requestTimeout = 5 * time.Second
)

type GetVersionResponse struct {
	Version string `json:"version"`
	GitHash string `json:"gitHash"`
}

func (h *Handler) GetVersion() (*GetVersionResponse, error) {
	h.log.Debug("Entering GetVersion")
	defer h.log.Debug("Leaving GetVersion")

	if err := h.ensureAppIsInitialised(); err != nil {
		return nil, err
	}

	return &GetVersionResponse{
		Version: app.Version,
		GitHash: app.VersionHash,
	}, nil
}

type CheckVersionResponse struct {
	Version    string `json:"version"`
	ReleaseURL string `json:"releaseUrl"`
}

func (h *Handler) CheckVersion() (*CheckVersionResponse, error) {
	h.log.Debug("Entering CheckVersion")
	defer h.log.Debug("Leaving CheckVersion")

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()
	v, err := vgversion.Check(vgversion.BuildGithubReleasesRequestFrom(ctx, ReleasesAPI), app.Version)
	if err != nil {
		return nil, fmt.Errorf("could not check latest releases: %w", err)
	}
	if v == nil {
		return nil, nil
	}
	return &CheckVersionResponse{
		Version:    v.String(),
		ReleaseURL: vgversion.GetGithubReleaseURL(ReleasesURL, v),
	}, nil
}
