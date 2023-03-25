package backend

import (
	"fmt"

	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
	"code.vegaprotocol.io/vegawallet/wallet"
)

type SearchForExistingConfigurationResponse struct {
	Wallets []string `json:"wallets"`
}

// SearchForExistingConfiguration searches for existing wallets and networks.
// This endpoint should be used to help the user to restore existing wallet
// setup in the app.
func (h *Handler) SearchForExistingConfiguration() (*SearchForExistingConfigurationResponse, error) {
	h.log.Debug("Entering SearchForExistingConfiguration")
	defer h.log.Debug("Leaving SearchForExistingConfiguration")

	defaultCfg := config.Config{
		VegaHome: "",
	}

	wStore, err := h.getWalletsStore(defaultCfg)
	if err != nil {
		return nil, err
	}

	listWallets, _ := wallet.ListWallets(wStore)

	return &SearchForExistingConfigurationResponse{
		Wallets: listWallets.Wallets,
	}, nil
}

// GetAppConfig return the application configuration.
func (h *Handler) GetAppConfig() (config.Config, error) {
	h.log.Debug("Entering GetAppConfig")
	defer h.log.Debug("Leaving GetAppConfig")

	return h.loadAppConfig()
}

// UpdateAppConfig update the application configuration. This requires a restart
// to take effect.
func (h *Handler) UpdateAppConfig(cfg *config.Config) error {
	h.log.Debug("Entering UpdateAppConfig")
	defer h.log.Debug("Leaving UpdateAppConfig")

	if !isSupportedLogLevel(cfg.LogLevel) {
		return fmt.Errorf("unsupported logger level %s", cfg.LogLevel)
	}

	return h.configLoader.SaveConfig(*cfg)
}
