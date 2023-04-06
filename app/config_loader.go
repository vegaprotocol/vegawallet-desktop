package app

import (
	"errors"
	"fmt"
	"strings"

	vgfs "code.vegaprotocol.io/vega/libs/fs"
	"code.vegaprotocol.io/vega/paths"
	"go.uber.org/zap"
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

	cfg, err := l.getConfigFileContent()
	if err != nil {
		return false, err
	}

	return cfg.OnBoardingDone, nil
}

func (l *ConfigLoader) GetConfig() (Config, error) {
	cfgFile, err := l.getConfigFileContent()
	if err != nil {
		return Config{}, err
	}

	config := Config{
		LogLevel:       cfgFile.LogLevel,
		VegaHome:       cfgFile.VegaHome,
		DefaultNetwork: cfgFile.DefaultNetwork,
		Telemetry:      cfgFile.Telemetry,
	}

	if err := config.EnsureIsValid(); err != nil {
		return Config{}, fmt.Errorf("the configuration for %q at %q is invalid: %w", OptimizedFor, l.configFilePath, err)
	}

	return config, nil
}

func (l *ConfigLoader) MarkOnBoardingAsDone() error {
	cfg, err := l.getConfigFileContent()
	if err != nil {
		return err
	}

	cfg.OnBoardingDone = true

	if err := paths.WriteStructuredFile(l.configFilePath, cfg); err != nil {
		return fmt.Errorf("could not write configuration file: %w", err)
	}

	return nil
}

func (l *ConfigLoader) SaveConfig(config Config) error {
	if config.VegaHome != "" {
		config.VegaHome = strings.Trim(config.VegaHome, " \t\n")
		if err := vgfs.EnsureDir(config.VegaHome); err != nil {
			return fmt.Errorf("could not create the vega home directory: %w", err)
		}
	}

	cfg, err := l.getConfigFileContent()
	if err != nil {
		return err
	}

	cfg.VegaHome = config.VegaHome
	cfg.LogLevel = config.LogLevel
	cfg.DefaultNetwork = config.DefaultNetwork
	cfg.Telemetry = config.Telemetry

	if err := paths.WriteStructuredFile(l.configFilePath, cfg); err != nil {
		return fmt.Errorf("could not write configuration file: %w", err)
	}

	return nil
}

func (l *ConfigLoader) getConfigFileContent() (configFile, error) {
	cfgFile := defaultConfigFile()

	configExists, err := vgfs.FileExists(l.configFilePath)
	if err != nil {
		return configFile{}, fmt.Errorf("could not verify the application configuration exists: %w", err)
	}
	if !configExists {
		return cfgFile, nil
	}

	if err := paths.ReadStructuredFile(l.configFilePath, &cfgFile); err != nil {
		return configFile{}, fmt.Errorf("could not read configuration file at %q: %w", l.configFilePath, err)
	}
	return cfgFile, nil
}

type configFile struct {
	LogLevel       string          `json:"logLevel"`
	VegaHome       string          `json:"vegaHome"`
	DefaultNetwork string          `json:"defaultNetwork"`
	Telemetry      TelemetryConfig `json:"telemetry"`
	OnBoardingDone bool            `json:"onBoardingDone"`
}

func defaultConfigFile() configFile {
	return configFile{
		LogLevel:       zap.InfoLevel.String(),
		VegaHome:       "",
		DefaultNetwork: defaultNetwork,
		Telemetry: TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		},
		OnBoardingDone: false,
	}
}
