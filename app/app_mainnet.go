//go:build !fairground

package app

import (
	_ "embed"
)

const (
	OptimizedFor = "mainnet"

	Name = "Vega Wallet"

	aboutAppTemplate = `Application to manage your Vega Protocol wallet on Mainnet.

%s (%s)

MIT License
Copyright (c) 2023 Gobalsky Labs Ltd.

This software is optimized for Mainnet.
`

	defaultNetwork = "mainnet1"
)
