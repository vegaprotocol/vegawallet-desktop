package backend

import (
	"errors"
)

var (
	ErrContextCanceled        = errors.New("context canceled")
	ErrConsentRequestNotFound = errors.New("consent request not found")
	ErrServiceAlreadyRunning  = errors.New("the service is already running")
	ErrServiceNotRunning      = errors.New("the service is not running")
	ErrTransactionNotFound    = errors.New("transaction not found")
)
