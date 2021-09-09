package config

import (
	"fmt"

	vgfs "code.vegaprotocol.io/shared/libs/fs"
	"code.vegaprotocol.io/shared/paths"
)

type Loader struct {
	configFilePath string
}

func NewLoader() (*Loader, error) {
	configPath, err := paths.DefaultConfigPathFor(paths.WalletDesktopDefaultConfigFile)
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletDesktopDefaultConfigFile, err)
	}

	return &Loader{
		configFilePath: configPath,
	}, nil
}

func (l *Loader) ConfigFilePath() string {
	return l.configFilePath
}

func (l *Loader) IsConfigInitialised() (bool, error) {
	return vgfs.FileExists(l.configFilePath)
}

func (l *Loader) GetConfig() (Config, error) {
	config := Config{}
	if err := paths.ReadStructuredFile(l.configFilePath, &config); err != nil {
		return Config{}, fmt.Errorf("couldn't read configuration file: %w", err)
	}

	return config, nil
}

func (l *Loader) SaveConfig(config Config) error {
	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return nil
}
