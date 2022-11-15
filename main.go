package main

import (
	"embed"
	_ "embed"
	"fmt"
	"os"
	"time"

	vgpprof "code.vegaprotocol.io/vega/libs/pprof"
	"code.vegaprotocol.io/vega/logging"
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

	startupLogFilePath, err := app.StartupLogFilePath()
	if err != nil {
		// There is not much we can do to log such an early error.
		panic(err)
	}

	startupLogger := logger.NewFileLogger(startupLogFilePath)

	pprofhandler, err := vgpprof.New(logging.NewDevLogger(), vgpprof.NewDefaultConfig())
	if err != nil {
		startupLogger.Fatal(fmt.Sprintf("Could not start pprof: %v", err))
	}
	defer func() {
		if err := pprofhandler.Stop(); err != nil {
			startupLogger.Warning(fmt.Sprintf("Could not stop pprof: %v", err))
		}
	}()

	defer func() {
		if r := recover(); r != nil {
			startupLogger.Fatal(fmt.Sprintf("Recovered from a panic: %v", r))
		}
	}()

	pid := os.Getpid()
	date := time.Now().UTC().Format("2006-01-02-15-04-05")

	// Create an instance of the handler structure
	handler, err := backend.NewHandler()
	if err != nil {
		startupLogger.Fatal(fmt.Sprintf("Couldn't instantiate the backend: %v, PID(%d), date(%v)", err, pid, date))
	}

	startupLogger.Info(fmt.Sprintf("Starting the application: PID(%d), date(%v)", pid, date))
	defer startupLogger.Info(fmt.Sprintf("The application exited: PID(%d), date(%v)", pid, date))

	// Create application with options
	if err := wails.Run(&options.App{
		Title:            app.Name,
		Width:            760,
		Height:           760,
		MinWidth:         460,
		MinHeight:        460,
		BackgroundColour: options.NewRGBA(0, 0, 0, 255),
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Logger:     startupLogger,
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
		startupLogger.Fatal(fmt.Sprintf("Couldn't run the application: %v, PID(%d), date(%v)", err, pid, date))
	}
}
