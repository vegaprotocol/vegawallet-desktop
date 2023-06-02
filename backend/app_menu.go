package backend

import (
	"fmt"
	"runtime"

	"code.vegaprotocol.io/vegawallet-desktop/app"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

const LEGAL_DISCLAIMER = `
The Vega Wallet is an application that allows users to, among other things, (i) access other Vega applications; (ii) manage multiple wallets and keys; and (iii) sign transactions on the Vega network. It is free, public and open source software.

The Vega Wallet is purely non-custodial application, meaning users never lose custody, possession, or control of their digital assets at any time.

Users are solely responsible for the custody of the cryptographic private keys to their Vega Wallet and and should never share their wallet credentials or seed phrase with anyone.

The Vega Wallet relies on emerging technologies that are subject to increased risk through users misuse of things such as public/private key cryptography or failing to properly update or run software to accommodate upgrades. The developers of the Vega Wallet do not operate or run the Vega Blockchain or any other blockchain. Digital tokens present market volatility risk, technical software risk, regulatory risk and cybersecurity risk.

Software upgrades may contain bugs or security vulnerabilities that might result in loss of functionality or assets.

The Vega Wallet is provided “as is”. The developers of the Vega Wallet make no representations or warranties of any kind, whether express or implied, statutory or otherwise regarding the Vega Wallet. They disclaim all warranties of merchantability, quality, fitness for purpose. They disclaim all warranties that the Vega Wallet is free of harmful components or errors.

No developer of the Vega Wallet accepts any responsibility for, or liability to users in connection with their use of the Vega Wallet. Users are solely  responsible for any associated wallet and no developer of the Vega Wallet is liable for any acts or omissions by users in connection with or as a result of their Vega Wallet or other associated wallet being compromised.
`

func (h *Handler) AppMenu() *menu.Menu {
	appMenu := menu.NewMenu()

	mainMenu := appMenu.AddSubmenu("Main")
	mainMenu.AddText(fmt.Sprintf("About %s", app.Name), nil, h.openAboutDialog)
	mainMenu.AddSeparator()

	// Legal disclaimer
	mainMenu.AddText("Disclaimer", nil, h.openDisclaimerDialog)
	mainMenu.AddSeparator()

	if runtime.GOOS == "darwin" {
		mainMenu.AddText(fmt.Sprintf("Hide %s", app.Name), keys.CmdOrCtrl("h"), func(_ *menu.CallbackData) {
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
		h.log.Error(fmt.Sprintf("could n0t open or close the about message dialogue: %s", err))
	}
}

func (h *Handler) openDisclaimerDialog(_ *menu.CallbackData) {
	_, err := wailsRuntime.MessageDialog(h.ctx, wailsRuntime.MessageDialogOptions{
		Type:          wailsRuntime.InfoDialog,
		Title:         "Disclaimer",
		Message:       LEGAL_DISCLAIMER,
		Icon:          h.icon,
		DefaultButton: "OK",
	})
	if err != nil {
		h.log.Error(fmt.Sprintf("could not open or close the disclaimer dialogue: %s", err))
	}
}
