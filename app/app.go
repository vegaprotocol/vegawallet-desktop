package app

import (
	"fmt"
	"runtime/debug"
)

var (
	// VersionHash specifies the git commit used to build the application.
	// See VERSION_HASH in Makefile for details.
	VersionHash = "unknown"

	// Version specifies the version used to build the application.
	// See VERSION in Makefile for details.
	Version = "v0.12.3"

	About = fmt.Sprintf(aboutAppTemplate, Version, VersionHash)
)

func init() {
	info, _ := debug.ReadBuildInfo()

	for _, v := range info.Settings {
		if v.Key == "vcs.revision" {
			VersionHash = v.Value[:8]
		}
	}

	About = fmt.Sprintf(aboutAppTemplate, Version, VersionHash)
}
