package backend

import (
	"errors"
	"time"

	"code.vegaprotocol.io/vega/protos/vega/wallet/v1"
	serviceV1 "code.vegaprotocol.io/vega/wallet/service/v1"
)

var ErrAPIv1Unsupported = errors.New("sending transactions through the API v1 is no longer supported")

type unsupportedV1APIPolicy struct {
}

func (u *unsupportedV1APIPolicy) Ask(_ *v1.SubmitTransactionRequest, _ string, _ time.Time) (bool, error) {
	return false, ErrAPIv1Unsupported
}

func (u *unsupportedV1APIPolicy) Report(_ serviceV1.SentTransaction) {
	// Nothing to do.
}
