package backend

import (
	"errors"
	"fmt"
	"path/filepath"

	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/adrg/xdg"
	"go.uber.org/zap"
)

var (
	ErrBackendNotStarted   = errors.New("the application backend is not started")
	ErrAppIsNotInitialised = errors.New("the application has not been initialised")
)

func (h *Handler) IsAppInitialised() (bool, error) {
	isAppInit, err := h.isAppInitialised()
	if err != nil {
		h.log.Error("Could not verify the application is initialized", zap.Error(err))
		return false, fmt.Errorf("could not verify the application is initialized: %w", err)
	}

	return isAppInit, nil
}

// isAppInitialised abstract the application initialization state verification,
// so we don't have to rely on the backend API to start the program.
func (h *Handler) isAppInitialised() (bool, error) {
	return h.configLoader.IsConfigInitialised()
}

type InitialiseAppRequest struct {
	VegaHome string `json:"vegaHome"`
}

func (h *Handler) InitialiseApp(req *InitialiseAppRequest) error {
	h.log.Debug("Entering InitialiseApp")
	defer h.log.Debug("Leaving InitialiseApp")

	cfg := app.DefaultConfig()
	cfg.VegaHome = req.VegaHome
	cfg.BoardingDone()

	if err := h.configLoader.SaveConfig(cfg); err != nil {
		h.log.Error("Could not save the application configuration", zap.Error(err))
		return fmt.Errorf("could not save the application configuration: %w", err)
	}

	h.appInitialised.Store(true)

	if err := h.reloadBackendComponentsFromConfig(); err != nil {
		h.log.Error("Could not reload the backend components during the application initialisation", zap.Error(err))
		return fmt.Errorf("could not reload the backend components during the application initialisation: %w", err)
	}

	return nil
}

func (h *Handler) SuggestFairgroundFolder() string {
	h.log.Debug("Entering SuggestFairgroundFolder")
	defer h.log.Debug("Leaving SuggestFairgroundFolder")

	return filepath.Join(xdg.Home, "Vega", "Fairground")
}

func (h *Handler) ensureBackendStarted() error {
	if !h.backendStarted.Load() {
		h.log.Error("The application backend is not started")
		return ErrBackendNotStarted
	}

	return nil
}

func (h *Handler) ensureAppIsInitialised() error {
	if !h.appInitialised.Load() {
		h.log.Error("The application is not initialised")
		return ErrAppIsNotInitialised
	}
	return nil
}
