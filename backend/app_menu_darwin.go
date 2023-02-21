//go:build darwin

package backend

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
)

func (h *Handler) AppMenu() *menu.Menu {
	appMenu := menu.NewMenu()

	appMenu.Append(menu.AppMenu())
	// Enable Cmd+C,Cmd+V,Cmd+Z... shortcut on macOS platform
	appMenu.Append(menu.EditMenu())

	h.commonAppMenu(appMenu)

	return appMenu
}
