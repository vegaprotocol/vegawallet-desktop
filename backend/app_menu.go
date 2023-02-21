package backend

import (
	"fmt"
	"runtime"

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

	if runtime.GOOS == "darwin" {
		mainMenu.AddText("Hide Vegawallet", keys.CmdOrCtrl("h"), func(_ *menu.CallbackData) {
			wailsRuntime.Hide(h.ctx)
		})
		mainMenu.AddSeparator()
	}

	mainMenu.AddText("Quit", keys.CmdOrCtrl("q"), func(_ *menu.CallbackData) {
		wailsRuntime.Quit(h.ctx)
	})

	if runtime.GOOS == "darwin" {
		appMenu.Append(menu.EditMenu()) // on macos platform, we should append EditMenu to enable Cmd+C,Cmd+V,Cmd+Z... shortcut
	}

	h.commonAppMenu(appMenu)

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
