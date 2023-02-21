package backend

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (h *Handler) commonAppMenu(appMenu *menu.Menu) {
	helpMenu := appMenu.AddSubmenu("Help")

	docSubMenu := helpMenu.AddSubmenu("Read the documentation")
	docSubMenu.AddText("Mainnet", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://docs.vega.xyz/mainnet/tools/vega-wallet/desktop-app")
	})
	docSubMenu.AddText("Testnet", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://docs.vega.xyz/testnet/tools/vega-wallet/desktop-app")
	})

	helpMenu.AddSeparator()
	helpMenu.AddText("Download a release", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://github.com/vegaprotocol/vegawallet-desktop/releases")
	})
	helpMenu.AddSeparator()

	helpMenu.AddText("Give your feedback on GitHub", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://github.com/vegaprotocol/feedback/discussions/categories/vega-wallets")
	})
}
