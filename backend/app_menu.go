//go:build !darwin

package backend

import (
	"fmt"

	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (h *Handler) AppMenu() *menu.Menu {
	appMenu := menu.NewMenu()
	mainMenu := appMenu.AddSubmenu("Main")
	mainMenu.AddText("About Vegawallet", nil, h.openAboutDialog)
	mainMenu.AddSeparator()
	mainMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		wailsRuntime.Quit(h.ctx)
	})

	return appMenu
}

func (h *Handler) openAboutDialog(_ *menu.CallbackData) {
	_, err := wailsRuntime.MessageDialog(h.ctx, wailsRuntime.MessageDialogOptions{
		Type:          wailsRuntime.InfoDialog,
		Title:         app.Name,
		Message:       app.About,
		Icon:          h.icon,
		DefaultButton: "OK",
	})
	if err != nil {
		h.log.Error(fmt.Sprintf("Couldn't open or close the about message dialog: %s", err))
	}
}
