package backend

import (
	"fmt"

	"code.vegaprotocol.io/vega/wallet/api"
	"code.vegaprotocol.io/vegawallet-desktop/backend/config"
)

type SearchForExistingConfigurationResponse struct {
	Wallets  []string `json:"wallets"`
	Networks []string `json:"networks"`
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

	netStore, err := h.getNetworksStore(defaultCfg)
	if err != nil {
		return nil, err
	}

	listWallets, _ := api.NewAdminListWallets(wStore).Handle(h.ctx, nil)
	listNetworks, _ := api.NewAdminListNetworks(netStore).Handle(h.ctx, nil)

	return &SearchForExistingConfigurationResponse{
		Wallets:  listWallets.(api.AdminListWalletsResult).Wallets,
		Networks: listNetworks.(api.AdminListNetworksResult).Networks,
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
