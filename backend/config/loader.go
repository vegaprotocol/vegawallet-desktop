package config

import (
	"fmt"
	"os"
	"time"

	vgfs "code.vegaprotocol.io/shared/libs/fs"
	"code.vegaprotocol.io/shared/paths"
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
	logFileName := fmt.Sprintf("%d-%s.log", pid, date)

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
	exists, err := vgfs.FileExists(l.configFilePath)
	if err != nil {
		return Config{}, fmt.Errorf("could not verify the application configuration exists: %w", err)
	}

	config := Config{
		LogLevel:       zap.InfoLevel.String(),
		VegaHome:       "",
		DefaultNetwork: "",
		Telemetry: &TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		},
	}

	if !exists {
		return config, nil
	}

	if err := paths.ReadStructuredFile(l.configFilePath, &config); err != nil {
		return Config{}, fmt.Errorf("couldn't read configuration file: %w", err)
	}

	if len(config.LogLevel) == 0 {
		config.LogLevel = zap.InfoLevel.String()
	}

	if config.Telemetry == nil {
		// We will opt in first. We will remove this once the on-boarding
		// workflow is rework to ask for user explicit consent.
		config.Telemetry = &TelemetryConfig{
			ConsentAsked: false,
			Enabled:      true,
		}
	}

	return config, nil
}

func (l *Loader) SaveConfig(config Config) error {
	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return nil
}
