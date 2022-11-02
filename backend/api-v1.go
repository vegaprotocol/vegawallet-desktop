package backend

import (
	"errors"
	"time"

	"code.vegaprotocol.io/vega/protos/vega/wallet/v1"
	"code.vegaprotocol.io/vega/wallet/service"
	"go.uber.org/zap"
)

var ErrAPIv1Unsupported = errors.New("sending transactions through the API v1 is no longer supported")

type unsupportedV1APIPolicy struct {
	log *zap.Logger
}

func (u *unsupportedV1APIPolicy) Ask(_ *v1.SubmitTransactionRequest, _ string, _ time.Time) (bool, error) {
	u.log.Warn("Sending transactions through the API v1 is no longer supported")
	return false, ErrAPIv1Unsupported
}

func (u *unsupportedV1APIPolicy) Report(_ service.SentTransaction) {
	// Nothing to do.
}
