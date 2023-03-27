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
	var relConfigFilePath paths.ConfigPath
	switch OptimizedFor {
	case "mainnet":
		relConfigFilePath = paths.WalletAppDefaultConfigFile
		break
	case "fairground":
		relConfigFilePath = paths.JoinConfigPath(paths.WalletAppConfigHome, "config.fairground.toml")
		break
	}

	configFilePath, err := paths.CreateDefaultConfigPathFor(relConfigFilePath)
	if err != nil {
		return nil, fmt.Errorf("could not create configuration file at %q: %w", relConfigFilePath, err)
	}

	return &ConfigLoader{
		configFilePath: configFilePath,
	}, nil
}

func (l *ConfigLoader) IsConfigInitialised() (bool, error) {
	configExists, err := vgfs.FileExists(l.configFilePath)
	if err != nil {
		return false, fmt.Errorf("could not verify the application configuration exists: %w", err)
	}

	if !configExists {
		return false, err
	}

	cfg, err := l.GetConfig()
	if err != nil {
		return false, err
	}

	return cfg.onBoardingDone, nil
}

func (l *ConfigLoader) GetConfig() (Config, error) {
	cfgFile := configFile{}

	if err := paths.ReadStructuredFile(l.configFilePath, &cfgFile); err != nil {
		return Config{}, fmt.Errorf("could not read configuration file at %q: %w", l.configFilePath, err)
	}

	config := DefaultConfig()

	config.VegaHome = cfgFile.VegaHome
	config.LogLevel = cfgFile.LogLevel
	config.DefaultNetwork = cfgFile.DefaultNetwork
	config.Telemetry = cfgFile.Telemetry
	config.onBoardingDone = cfgFile.OnBoardingDone

	if err := config.EnsureIsValid(); err != nil {
		return Config{}, fmt.Errorf("the configuration for %q at %q is invalid: %w", OptimizedFor, l.configFilePath, err)
	}

	return *config, nil
}

func (l *ConfigLoader) SaveConfig(config Config) error {
	cfg := configFile{}

	configExists, err := vgfs.FileExists(l.configFilePath)
	if err != nil {
		return fmt.Errorf("could not verify the application configuration exists: %w", err)
	}

	if configExists {
		if err := paths.ReadStructuredFile(l.configFilePath, &cfg); err != nil {
			return fmt.Errorf("could not read configuration file at %q: %w", l.configFilePath, err)
		}
	} else {
		if err := vgfs.EnsureDir(config.VegaHome); err != nil {
			return fmt.Errorf("could not create the vega home directory: %w", err)
		}
	}

	cfg.VegaHome = config.VegaHome
	cfg.LogLevel = config.LogLevel
	cfg.DefaultNetwork = config.DefaultNetwork
	cfg.Telemetry = config.Telemetry

	if !cfg.OnBoardingDone {
		cfg.OnBoardingDone = config.onBoardingDone
	}

	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("could not write configuration file: %w", err)
	}

	return nil
}

type configFile struct {
	LogLevel       string          `json:"logLevel"`
	VegaHome       string          `json:"vegaHome"`
	DefaultNetwork string          `json:"defaultNetwork"`
	Telemetry      TelemetryConfig `json:"telemetry"`
	OnBoardingDone bool            `json:"onBoardingDone"`
}
