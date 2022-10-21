package backend

import (
	"errors"
	"time"

	"code.vegaprotocol.io/vega/protos/vega/wallet/v1"
	"code.vegaprotocol.io/vega/wallet/service"
)

var ErrAPIv1Unsupported = errors.New("sending transactions through the API v1 is no longer supported")

type UnsupportedV1APIPolicy struct{}

func (u UnsupportedV1APIPolicy) Ask(_ *v1.SubmitTransactionRequest, _ string, _ time.Time) (bool, error) {
	return false, ErrAPIv1Unsupported
}

func (u UnsupportedV1APIPolicy) Report(_ service.SentTransaction) {
	// Nothing to do.
}
