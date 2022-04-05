package backend

import (
	"errors"
)

var (
	ErrCouldNotListTransactions      = errors.New("couldn't list pending transactions")
	ErrTransactionNotFound           = errors.New("transaction not found")
	ErrCouldNotGetTransactionConsent = errors.New("could not decode transaction")
	ErrCouldNotDecodeTransaction     = errors.New("could not decode transaction")
)
