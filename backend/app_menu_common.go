package backend

import (
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (h *Handler) commonAppMenu(appMenu *menu.Menu) {
	windowMenu := appMenu.AddSubmenu("Window")

	windowMenu.AddText("Minimize", keys.CmdOrCtrl("m"), func(_ *menu.CallbackData) {
		wailsRuntime.Hide(h.ctx)
	})
	windowMenu.AddText("Close", keys.CmdOrCtrl("w"), func(_ *menu.CallbackData) {
		wailsRuntime.Hide(h.ctx)
	})

	helpMenu := appMenu.AddSubmenu("Help")

	docSubMenu := helpMenu.AddSubmenu("Read the documentation")
	docSubMenu.AddText(app.Name, nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, softwareDocumentationURL)
	})
	if apiDocumentationURL != "" {
		docSubMenu.AddText("API", nil, func(*menu.CallbackData) {
			wailsRuntime.BrowserOpenURL(h.ctx, apiDocumentationURL)
		})
	}
	docSubMenu.AddText("Testnet", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://docs.vega.xyz/testnet/tools/vega-wallet/desktop-app")
	})

	helpMenu.AddText("Give your feedback on GitHub", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://github.com/vegaprotocol/feedback/discussions/categories/vega-wallets")
	})
}
