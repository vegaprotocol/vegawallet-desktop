package backend

import (
	"context"
	"fmt"
	"time"

	vgversion "code.vegaprotocol.io/shared/libs/version"
)

const (
	ReleasesAPI        = "https://api.github.com/repos/vegaprotocol/vegawallet-desktop/releases"
	ReleasesURL        = "https://github.com/vegaprotocol/vegawallet-desktop/releases"
	defaultVersionHash = "unknown"
	defaultVersion     = "v0.1.1"
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
	Version string `json:"version"`
	GitHash string `json:"gitHash"`
}

func (h *Handler) GetVersion() *GetVersionResponse {
	h.log.Debug("Entering GetVersion")
	defer h.log.Debug("Leaving GetVersion")

	return &GetVersionResponse{
		Version: Version,
		GitHash: Hash,
	}
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
	v, err := vgversion.Check(vgversion.BuildGithubReleasesRequestFrom(ctx, ReleasesAPI), Version)
	if err != nil {
		return nil, fmt.Errorf("couldn't check latest releases: %w", err)
	}
	if v == nil {
		return nil, nil
	}
	return &CheckVersionResponse{
		Version:    v.String(),
		ReleaseURL: vgversion.GetGithubReleaseURL(ReleasesURL, v),
	}, nil
}
