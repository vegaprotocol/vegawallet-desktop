package main

import (
	"embed"
	_ "embed"
	"fmt"
	"os"
	"time"

	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/backend"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	log := startupLogger()

	defer func() {
		if r := recover(); r != nil {
			log.Fatal(fmt.Sprintf("Recovered from a panic: %v", r))
		}
	}()

	pid := os.Getpid()
	date := time.Now().UTC().Format("2006-01-02-15-04-05")

	// Create an instance of the handler structure
	handler := backend.NewHandler(icon)

	log.Info(fmt.Sprintf("Starting the application: PID(%d), date(%v)", pid, date))
	defer log.Info(fmt.Sprintf("The application exited: PID(%d), date(%v)", pid, date))

	// Create application with options
	if err := wails.Run(&options.App{
		Title:            app.Name,
		Width:            760,
		Height:           760,
		MinWidth:         460,
		MinHeight:        460,
		Menu:             handler.AppMenu(),
		BackgroundColour: options.NewRGBA(0, 0, 0, 255),
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Logger:     log,
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
				Title:   app.Name,
				Message: app.About,
				Icon:    icon,
			},
		},
		Linux: &linux.Options{
			Icon: icon,
		},
	}); err != nil {
		log.Fatal(fmt.Sprintf("The application encountered an error while running: %v, PID(%d), date(%v)", err, pid, date))
	}
}

func startupLogger() logger.Logger {
	startupLogFilePath, err := app.StartupLogFilePath()
	if err != nil {
		// There is not much we can do, except fallback on a basic standard output
		// logger.
		return logger.NewDefaultLogger()
	}

	return logger.NewFileLogger(startupLogFilePath)
}
