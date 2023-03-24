//go:build fairground

package app

import (
	_ "embed"
)

const (
	OptimizedFor = "fairground"

	Name = "Fairground Wallet"

	aboutAppTemplate = `Application to manage your Vega Protocol wallet on Fairground.

%s (%s)

MIT License
Copyright (c) 2023 Gobalsky Labs Ltd.

This software is optimized for Fairground.
`

	defaultNetwork = "fairground"
)
