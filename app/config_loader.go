package app

import (
	"errors"
	"fmt"

	vgfs "code.vegaprotocol.io/vega/libs/fs"
	"code.vegaprotocol.io/vega/paths"
)

var ErrLogLevelIsRequired = errors.New("the log level is required")

type ConfigLoader struct {
	configFilePath string
}

func NewConfigLoader() (*ConfigLoader, error) {
	configFilePath, err := paths.CreateDefaultConfigPathFor(paths.WalletAppDefaultConfigFile)
	if err != nil {
		return nil, fmt.Errorf("could not create configuration file at %s: %w", paths.WalletAppDefaultConfigFile, err)
	}

	return &ConfigLoader{
		configFilePath: configFilePath,
	}, nil
}

func (l *ConfigLoader) IsConfigInitialised() (bool, error) {
	return vgfs.FileExists(l.configFilePath)
}

func (l *ConfigLoader) GetConfig() (Config, error) {
	cfg := DefaultConfig()

	if err := paths.ReadStructuredFile(l.configFilePath, &cfg); err != nil {
		return Config{}, fmt.Errorf("could not read configuration file at %q: %w", l.configFilePath, err)
	}

	if err := cfg.EnsureIsValid(); err != nil {
		return Config{}, fmt.Errorf("the configuration at %q is invalid: %w", l.configFilePath, err)
	}

	return cfg, nil
}

func (l *ConfigLoader) SaveConfig(config Config) error {
	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("could not write configuration file: %w", err)
	}

	return nil
}
