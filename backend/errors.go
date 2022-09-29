package backend

import (
	"errors"
)

var (
	ErrConsentRequestNotFound = errors.New("consent request not found")
	ErrServiceAlreadyRunning  = errors.New("the service is already running")
	ErrServiceNotRunning      = errors.New("the service is not running")
	ErrTransactionNotFound    = errors.New("transaction not found")
)
