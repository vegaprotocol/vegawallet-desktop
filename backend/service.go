package backend

import (
	"time"

	"code.vegaprotocol.io/go-wallet/service"
	"code.vegaprotocol.io/go-wallet/service/encoding"
	"github.com/wailsapp/wails"
	"go.uber.org/zap"
)

type Backend struct {
	runtime *wails.Runtime
	log     *wails.CustomLogger
}

func (b *Backend) WailsInit(runtime *wails.Runtime) error {
	b.runtime = runtime
	b.log = runtime.Log.New("Backend")
	return nil
}

func (b *Backend) GetConfig() service.Config {
	b.log.Debug("Entering GetConfig()...")
	defer b.log.Debug("Leaving GetConfig()...")

	return service.Config{
		Level:       encoding.LogLevel{Level: zap.InfoLevel},
		TokenExpiry: encoding.Duration{Duration: time.Hour * 24 * 7},
		Nodes: service.NodesConfig{
			Hosts: []string{
				"n01.testnet.vega.xyz:3002",
				"n02.testnet.vega.xyz:3002",
			},
			Retries: 5,
		},
		Host: "127.0.0.1",
		Port: 1789,
		Console: service.ConsoleConfig{
			URL:       "console.fairground.wtf",
			LocalPort: 1847,
		},
	}
}
