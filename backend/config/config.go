package config

type Config struct {
	LogLevel       string           `json:"logLevel"`
	VegaHome       string           `json:"vegaHome"`
	DefaultNetwork string           `json:"defaultNetwork"`
	Telemetry      *TelemetryConfig `json:"telemetry"`
	OnBoardingDone bool             `json:"onBoardingDone"`
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
