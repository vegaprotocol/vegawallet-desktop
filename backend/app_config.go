package backend

import (
	"fmt"

	"code.vegaprotocol.io/vega/paths"
	"code.vegaprotocol.io/vega/wallet/api"
	netStoreV1 "code.vegaprotocol.io/vega/wallet/network/store/v1"
	"code.vegaprotocol.io/vega/wallet/wallets"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const (
	ReloadingEntireApplicationRequired = "reloading_entire_application_required"
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

	defaultCfg := app.Config{
		VegaHome: "",
	}

	vegaPaths := paths.New(defaultCfg.VegaHome)

	netStore, err := netStoreV1.InitialiseStore(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the networks store: %v", err))
		return nil, fmt.Errorf("could not initialise the networks store: %w", err)
	}

	walletStore, err := wallets.InitialiseStoreFromPaths(vegaPaths)
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't initialise the wallets store: %v", err))
		return nil, fmt.Errorf("could not initialise the wallets store: %w", err)
	}

	listWallets, _ := api.NewAdminListWallets(walletStore).Handle(h.ctx, nil)
	listNetworks, _ := api.NewAdminListNetworks(netStore).Handle(h.ctx, nil)

	networks := listNetworks.(api.AdminListNetworksResult).Networks

	networkNames := make([]string, 0, len(networks))
	for _, net := range networks {
		networkNames = append(networkNames, net.Name)
	}

	return &SearchForExistingConfigurationResponse{
		Wallets:  listWallets.(api.AdminListWalletsResult).Wallets,
		Networks: networkNames,
	}, nil
}

// GetAppConfig return the application configuration.
func (h *Handler) GetAppConfig() (app.Config, error) {
	if err := h.ensureBackendStarted(); err != nil {
		return app.Config{}, err
	}

	h.log.Debug("Entering GetAppConfig")
	defer h.log.Debug("Leaving GetAppConfig")

	if err := h.ensureAppIsInitialised(); err != nil {
		return app.Config{}, err
	}

	return h.appConfig()
}

// UpdateAppConfig update the application configuration. This requires a restart
// to take effect.
func (h *Handler) UpdateAppConfig(updatedConfig app.Config) error {
	if err := h.ensureBackendStarted(); err != nil {
		return err
	}

	h.log.Debug("Entering UpdateAppConfig")
	defer h.log.Debug("Leaving UpdateAppConfig")

	if err := h.ensureAppIsInitialised(); err != nil {
		return err
	}

	if err := updatedConfig.EnsureIsValid(); err != nil {
		return err
	}

	if updatedConfig.DefaultNetwork != "" {
		if exists, err := h.networkStore.NetworkExists(updatedConfig.DefaultNetwork); err != nil {
			return fmt.Errorf("could not verify the network exists: %w", err)
		} else if !exists {
			return fmt.Errorf("the network %q does not exist", updatedConfig.DefaultNetwork)
		}
	}

	existingConfig, err := h.appConfig()
	if err != nil {
		return err
	}

	if err := h.configLoader.SaveConfig(updatedConfig); err != nil {
		h.log.Error("Could not save the application configuration", zap.Error(err))
		return fmt.Errorf("could not save the application configuration: %w", err)
	}

	// The vega home dictates where to find the wallets, the networks, where to put
	// the log files, etc. So, if it has been updated, we need to reload the entire
	// application.
	reloadEntireAppRequired := existingConfig.VegaHome != updatedConfig.VegaHome

	if reloadEntireAppRequired {
		runtime.EventsEmit(h.ctx, ReloadingEntireApplicationRequired)
		if err := h.reloadBackendComponentsFromConfig(); err != nil {
			h.log.Error("Could not reload the backend components after the application configuration update", zap.Error(err))
			return fmt.Errorf("could not reload the backend components after the application configuration update: %w", err)
		}
	} else {
		if err := h.updateBackendComponentsFromConfig(); err != nil {
			h.log.Error("Could not update the backend components after the application configuration update", zap.Error(err))
			return fmt.Errorf("could not update the backend components after the application configuration update: %w", err)
		}
	}

	return nil
}
