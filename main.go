package main

import (
	"embed"
	_ "embed"
	"fmt"

	"code.vegaprotocol.io/vegawallet-desktop/backend"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	log := logger.NewDefaultLogger()

	// Create an instance of the handler structure
	handler, err := backend.NewHandler()
	if err != nil {
		log.Fatal(fmt.Sprintf("Couldn't instantiate backend: %v", err))
	}

	// Create application with options
	if err := wails.Run(&options.App{
		Title:      "Vegawallet",
		Width:      460,
		Height:     760,
		MinWidth:   460,
		MinHeight:  760,
		RGBA:       &options.RGBA{R: 0, G: 0, B: 0, A: 255},
		Assets:     assets,
		LogLevel:   logger.INFO,
		OnStartup:  handler.Startup,
		OnDomReady: handler.DOMReady,
		OnShutdown: handler.Shutdown,
		Bind: []interface{}{
			handler,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
		},
		Mac: &mac.Options{
			TitleBar:             mac.TitleBarHiddenInset(),
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   "Vegawallet",
				Message: fmt.Sprintf("Application to manage your Vega Protocol wallet.\n\n%s - %s\n\nMIT License\nCopyright (c) 2022 Gobalsky Labs Ltd.", backend.Version, backend.Hash),
				Icon:    icon,
			},
		},
	}); err != nil {
		log.Fatal(fmt.Sprintf("Couldn't run the application: %v", err))
	}
}
