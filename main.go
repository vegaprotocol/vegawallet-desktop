package main

import (
	"embed"
	_ "embed"
	"fmt"
	"os"
	"time"

	"code.vegaprotocol.io/shared/paths"
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

	log.Info(fmt.Sprintf("Starting the application: PID(%d), date(%v)", pid, date))
	defer log.Info(fmt.Sprintf("The application exited: PID(%d), date(%v)", pid, date))

	// Create an instance of the handler structure
	handler, err := backend.NewHandler()
	if err != nil {
		log.Fatal(fmt.Sprintf("Couldn't instantiate backend: %v", err))
	}

	// Create application with options
	if err := wails.Run(&options.App{
		Title:            "Vegawallet",
		Width:            460,
		Height:           760,
		MinWidth:         460,
		MinHeight:        760,
		BackgroundColour: options.NewRGBA(0, 0, 0, 255),
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
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
		Linux: &linux.Options{
			Icon: icon,
		},
	}); err != nil {
		log.Fatal(fmt.Sprintf("Couldn't run the application: %v", err))
	}
}

func startupLogger() logger.Logger {
	startupLogFilePath, err := StartupLogFilePath()
	if err != nil {
		// There is not much we can do, except fallback on a basic standard output
		// logger.
		return logger.NewDefaultLogger()
	}

	return logger.NewFileLogger(startupLogFilePath)
}

func StartupLogFilePath() (string, error) {
	startupLogFileName := paths.JoinStatePath(paths.WalletAppLogsHome, "startup.log")
	startupLogFilePath, err := paths.CreateDefaultStatePathFor(startupLogFileName)
	if err != nil {
		return "", fmt.Errorf("could not get path for %s: %w", paths.WalletAppDefaultConfigFile, err)
	}
	return startupLogFilePath, nil
}
