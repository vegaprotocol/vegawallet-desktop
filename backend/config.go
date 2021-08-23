package backend

import (
	"bytes"
	"fmt"

	vgfs "desktop-wallet/libs/fs"

	"github.com/adrg/xdg"
	"github.com/zannen/toml"
)

const (
	configFile = "vega-wallet/config.toml"
)

type Config struct {
	WalletRootPath string
}

func HasConfig() (bool, error) {
	configFilePath, err := xdg.ConfigFile(configFile)
	if err != nil {
		return false, fmt.Errorf("couldn't get configuration file path: %w", err)
	}

	exists, err := vgfs.FileExists(configFilePath)
	if err != nil {
		return false, fmt.Errorf("couldn't verify existance of configuration file: %w", err)
	}

	return exists, nil
}

func LocateConfig() (string, error) {
	return xdg.ConfigFile(configFile)
}

func LoadConfig() (Config, error) {
	configFilePath, err := xdg.ConfigFile(configFile)
	if err != nil {
		return Config{}, fmt.Errorf("couldn't get configuration file path: %w", err)
	}

	buf, err := vgfs.ReadFile(configFilePath)
	if err != nil {
		return Config{}, fmt.Errorf("couldn't read configuration file: %w", err)
	}

	config := &Config{}
	if _, err := toml.Decode(string(buf), &config); err != nil {
		return Config{}, fmt.Errorf("couldn't decode configuration file: %w", err)
	}

	return *config, nil
}

func SaveConfig(config Config) error {
	configFilePath, err := xdg.ConfigFile(configFile)
	if err != nil {
		return fmt.Errorf("couldn't get configuration file path: %w", err)
	}

	buf := new(bytes.Buffer)
	if err := toml.NewEncoder(buf).Encode(config); err != nil {
		return fmt.Errorf("couldn't encode configuration file: %w", err)
	}

	if err := vgfs.WriteFile(buf.Bytes(), configFilePath); err != nil {
		return fmt.Errorf("couldn't write configuration file: %w", err)
	}

	return nil
}
