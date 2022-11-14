package app

import (
	"fmt"
	"runtime/debug"
)

const (
	Name = "Vegawallet"

	aboutAppTemplate = `Application to manage your Vega Protocol wallet.

%s (%s)

MIT License
Copyright (c) 2022 Gobalsky Labs Ltd.
`
)

var (
	// VersionHash specifies the git commit used to build the application.
	// See VERSION_HASH in Makefile for details.
	VersionHash = "unknown"

	// Version specifies the version used to build the application.
	// See VERSION in Makefile for details.
	Version = "v0.5.0+dev"

	About = fmt.Sprintf(aboutAppTemplate, Version, VersionHash)
)

func init() {
	info, _ := debug.ReadBuildInfo()
	modified := false

	for _, v := range info.Settings {
		if v.Key == "vcs.revision" {
			VersionHash = v.Value[:8]
		}
		if v.Key == "vcs.modified" && v.Value == "true" {
			modified = true
		}
	}
	if modified {
		VersionHash += "-modified"
	}

	About = fmt.Sprintf(aboutAppTemplate, Version, VersionHash)
}
