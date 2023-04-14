package backend

import (
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/wailsapp/wails/v2/pkg/menu"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (h *Handler) commonAppMenu(appMenu *menu.Menu) {
	helpMenu := appMenu.AddSubmenu("Help")

	if softwareDocumentationURL != "" && apiDocumentationURL != "" {
		docSubMenu := helpMenu.AddSubmenu("Read the documentation")

		if softwareDocumentationURL != "" {
			docSubMenu.AddText(app.Name, nil, func(*menu.CallbackData) {
				wailsRuntime.BrowserOpenURL(h.ctx, softwareDocumentationURL)
			})
		}

		if apiDocumentationURL != "" {
			docSubMenu.AddText("API", nil, func(*menu.CallbackData) {
				wailsRuntime.BrowserOpenURL(h.ctx, apiDocumentationURL)
			})
		}
	}

	helpMenu.AddText("Give your feedback on GitHub", nil, func(*menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(h.ctx, "https://github.com/vegaprotocol/feedback/discussions/categories/vega-wallets")
	})
}
