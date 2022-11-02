package app

import (
	"fmt"

	"code.vegaprotocol.io/vega/paths"
)

type FilesLocation struct {
	AppFiles  AppFilesLocation  `json:"appFiles"`
	HomeFiles HomeFilesLocation `json:"homeFiles"`
}

type AppFilesLocation struct {
	ConfigFile     string `json:"applicationConfigFile"`
	StartupLogFile string `json:"startupLogFile"`
	BackendLogFile string `json:"backendLogFile"`
}

type HomeFilesLocation struct {
	ServiceLogsDirectory string `json:"serviceLogsFolder"`
	WalletsFolder        string `json:"walletsFolder"`
	NetworksFolder       string `json:"networksFolder"`
}

func StartupLogFilePath() (string, error) {
	startupLogFileName := paths.JoinStatePath(paths.WalletAppLogsHome, "startup.log")
	startupLogFilePath, err := paths.CreateDefaultStatePathFor(startupLogFileName)
	if err != nil {
		return "", fmt.Errorf("could not get path for %s: %w", paths.WalletAppDefaultConfigFile, err)
	}
	return startupLogFilePath, nil
}
