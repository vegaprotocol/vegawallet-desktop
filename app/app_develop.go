//go:build !fairground && !mainnet

package app

import (
	_ "embed"
)

const (
	OptimizedFor = "develop"

	Name = "Vega Wallet Dev"

	aboutAppTemplate = `Application to manage your Vega Protocol wallet on development networks.

%s (%s)

MIT License
Copyright (c) 2023 Gobalsky Labs Ltd.
`

	defaultNetwork = ""
)
