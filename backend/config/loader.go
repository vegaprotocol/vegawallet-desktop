package config

import (
	"fmt"
	"time"

	vgfs "code.vegaprotocol.io/shared/libs/fs"
	"code.vegaprotocol.io/shared/paths"
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

	y, m, d := time.Now().UTC().Date()
	logFileForApp := fmt.Sprintf("app-%d-%d-%d.log", y, m, d)
	logPathForApp, err := paths.CreateDefaultStatePathFor(paths.JoinStatePath(paths.WalletAppLogsHome, logFileForApp))
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletAppDefaultConfigFile, err)
	}

	logFileForSvc := fmt.Sprintf("service-%d-%d-%d.log", y, m, d)
	logPathForSvc, err := paths.CreateDefaultStatePathFor(paths.JoinStatePath(paths.WalletAppLogsHome, logFileForSvc))
	if err != nil {
		return nil, fmt.Errorf("couldn't get path for %s: %w", paths.WalletAppDefaultConfigFile, err)
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

	return config, nil
}

func (l *Loader) SaveConfig(config Config) error {
	if err := paths.WriteStructuredFile(l.configFilePath, config); err != nil {
		return fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return nil
}
