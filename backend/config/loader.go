package config

import (
	"fmt"
	"os"
	"time"

	vgfs "code.vegaprotocol.io/vega/libs/fs"
	"code.vegaprotocol.io/vega/paths"
	"go.uber.org/zap"
)

type Loader struct {
	configFilePath    string
	logFilePathForApp string
	logFilePathForSvc string
}

func NewLoader() (*Loader, error) {
	configPath, err := paths.CreateDefaultConfigPathFor(paths.WalletAppDefaultConfigFile)
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletAppDefaultConfigFile, err)
	}

	pid := os.Getpid()
	date := time.Now().UTC().Format("2006-01-02-15-04-05")
	logFileName := fmt.Sprintf("%s-%d.log", date, pid)

	logPathForApp, err := paths.CreateDefaultStatePathFor(paths.JoinStatePath(paths.WalletAppLogsHome, logFileName))
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletAppLogsHome, err)
	}

	logPathForSvc, err := paths.CreateDefaultStatePathFor(paths.JoinStatePath(paths.WalletServiceLogsHome, logFileName))
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletServiceLogsHome, err)
	}

	return &Loader{
		configFilePath:    configPath,
		logFilePathForApp: logPathForApp,
		logFilePathForSvc: logPathForSvc,
	}, nil
}

func (l *Loader) ConfigFilePath() string {
	return l.configFilePath
}

func (l *Loader) LogFilePathForApp() string {
	return l.logFilePathForApp
}

func (l *Loader) LogFilePathForSvc() string {
	return l.logFilePathForSvc
}

func (l *Loader) IsConfigInitialised() (bool, error) {
	return vgfs.FileExists(l.configFilePath)
}

func (l *Loader) GetConfig() (Config, error) {
	config := Config{}
	if err := paths.ReadStructuredFile(l.configFilePath, &config); err != nil {
		return Config{}, fmt.Errorf("couldn't read configuration file: %w", err)
	}

	if len(config.LogLevel) == 0 {
		config.LogLevel = zap.InfoLevel.String()
	}

	// We will opt in first. We will remove this once the on-boarding
	// workflow is rework to ask for user explicit consent.
	if !config.Telemetry.ConsentAsked {
		config.Telemetry.Enabled = true
	}

	return config, nil
}

func (l *Loader) GenerateDefaultConfig() (Config, error) {
	cfg := DefaultConfig()
	if err := paths.WriteStructuredFile(l.configFilePath, cfg); err != nil {
		return Config{}, fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return cfg, nil
}

func (l *Loader) SaveConfig(config Config) error {
	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return nil
}
