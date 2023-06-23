package app

import (
	"errors"
	"fmt"

	vgfs "code.vegaprotocol.io/vega/libs/fs"
	vgzap "code.vegaprotocol.io/vega/libs/zap"
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

func (c *Config) EnsureIsValid() error {
	if len(c.LogLevel) == 0 {
		return ErrLogLevelIsRequired
	}

	if err := vgzap.EnsureIsSupportedLogLevel(c.LogLevel); err != nil {
		return err
	}

	// if a custom home path is set validate it
	if c.VegaHome != "" {
		exists, err := vgfs.FileExists(c.VegaHome)
		switch {
		case errors.Is(err, vgfs.ErrIsADirectory): // this is what we want
		case err != nil:
			return fmt.Errorf("unable to check if path exists %s: %w", c.VegaHome, err)
		case !exists:
			return fmt.Errorf("the specified wallet directory does not exist: %s", c.VegaHome)
		default:
			return fmt.Errorf("the specified wallet directory is not a directory: %s", c.VegaHome)
		}
	}

	return nil
}
