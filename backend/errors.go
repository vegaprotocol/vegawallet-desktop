package backend

import (
	"errors"
)

var (
	ErrConsentRequestNotFound = errors.New("consent request not found")
	ErrTransactionNotFound    = errors.New("transaction not found")
)
