package app

import (
	vgzap "code.vegaprotocol.io/vega/libs/zap"
	"go.uber.org/zap"
)

type Config struct {
	LogLevel       string          `json:"logLevel"`
	VegaHome       string          `json:"vegaHome"`
	DefaultNetwork string          `json:"defaultNetwork"`
	Telemetry      TelemetryConfig `json:"telemetry"`
}

// TelemetryConfig is used to configure the telemetry collection on the client.
type TelemetryConfig struct {
	// ConsentAsked is used to determine if the user has been asked for his
	// consent for telemetry collection.
	ConsentAsked bool `json:"consentAsked"`

	// Enabled is used to enable or disable the collection of errors on the
	// software.
	Enabled bool `json:"enabled"`
}

func DefaultConfig() Config {
	return Config{
		LogLevel:       zap.InfoLevel.String(),
		VegaHome:       "",
		DefaultNetwork: "",
		Telemetry: TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		},
	}
}

func (c Config) EnsureIsValid() error {
	if len(c.LogLevel) == 0 {
		return ErrLogLevelIsRequired
	}

	if err := vgzap.EnsureIsSupportedLogLevel(c.LogLevel); err != nil {
		return err
	}

	return nil
}
