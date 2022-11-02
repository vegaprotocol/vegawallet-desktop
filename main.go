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
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

func main() {
	startupLogFilePath, err := app.StartupLogFilePath()
	if err != nil {
		// There is not much we can do to log such an early error.
		panic(err)
	}

	log := logger.NewFileLogger(startupLogFilePath)

	defer func() {
		if r := recover(); r != nil {
			log.Fatal(fmt.Sprintf("Recovered from a panic: %v", r))
		}
	}()

	pid := os.Getpid()
	date := time.Now().UTC().Format("2006-01-02-15-04-05")

	// Create an instance of the handler structure
	handler, err := backend.NewHandler()
	if err != nil {
		log.Fatal(fmt.Sprintf("Couldn't instantiate the backend: %v, PID(%d), date(%v)", err, pid, date))
	}

	log.Info(fmt.Sprintf("Starting the application: PID(%d), date(%v)", pid, date))
	defer log.Info(fmt.Sprintf("The application exited: PID(%d), date(%v)", pid, date))

	// Create application with options
	if err := wails.Run(&options.App{
		Title:            app.Name,
		Width:            760,
		Height:           760,
		MinWidth:         460,
		MinHeight:        460,
		BackgroundColour: options.NewRGBA(0, 0, 0, 255),
		Assets:           assets,
		Logger:           log,
		LogLevel:         logger.INFO,
		OnStartup:        handler.Startup,
		OnDomReady:       handler.DOMReady,
		OnShutdown:       handler.Shutdown,
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
	}); err != nil {
		log.Fatal(fmt.Sprintf("Couldn't run the application: %v, PID(%d), date(%v)", err, pid, date))
	}
}
