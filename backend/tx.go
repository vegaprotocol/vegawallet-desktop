package backend

import (
	walletv1 "code.vegaprotocol.io/protos/vega/wallet/v1"
	"code.vegaprotocol.io/vegawallet/service"
	"github.com/golang/protobuf/jsonpb"
	"go.uber.org/zap"
)

const NewPendingTxEvent = "new_pending_transaction"

type PendingTransaction struct {
	Hash    string `json:hash`
	PubKey  string `json:"pubKey"`
	Command string `json:"command"`
}

type ConsentPendingTransactionRequest struct {
	Hash     string `json:"hash"`
	Decision bool   `json:"decision"`
}

func (h *Handler) ConsentPendingTransaction(req *ConsentPendingTransactionRequest) error {
	h.log.Debug("Entering ConsentPendingTransaction")
	defer h.log.Debug("Leaving ConsentPendingTransaction")

	signRequest := h.pendingSignRequests[req.Hash]
	txStr, err := signRequest.String()
	if err != nil {
		h.log.Error("failed to marshall sign request content", zap.Any("request", signRequest))
		return err
	}
	if req.Decision {
		h.log.Info("user approved sign request for transaction", zap.Any("transaction", signRequest))
		signRequest.Confirmations <- service.ConsentConfirmation{Decision: true, TxStr: txStr}

	} else {
		h.log.Info("user declined sign request for transaction", zap.Any("transaction", signRequest))
		signRequest.Confirmations <- service.ConsentConfirmation{Decision: false, TxStr: txStr}
	}
	close(signRequest.Confirmations)

	return nil
}

type GetPendingTransactionRequest struct {
	Hash string `json:"hash"`
}

func (h *Handler) GetPendingTransaction(req *GetPendingTransactionRequest) (*PendingTransaction, error) {
	h.log.Debug("Entering GetPendingTransaction")
	defer h.log.Debug("Leaving GetPendingTransaction")

	signRequest := h.pendingSignRequests[req.Hash]
	txStr, err := signRequest.String()
	if err != nil {
		h.log.Error("failed to marshall sign request content", zap.Any("request", signRequest))
		return nil, err
	}

	unmarshalled := &walletv1.SubmitTransactionRequest{}
	if err := jsonpb.UnmarshalString(txStr, unmarshalled); err != nil {
		return nil, err
	}

	return &PendingTransaction{
		PubKey:  unmarshalled.PubKey,
		Command: unmarshalled.String(),
		Hash:    signRequest.TxHash(),
	}, nil
}

type GetPendingTransactionsResponse struct {
	Transactions []*PendingTransaction `json:"transactions"`
}

func (h *Handler) GetPendingTransactions() *GetPendingTransactionsResponse {
	h.log.Debug("Entering GetPendingTransaction")
	defer h.log.Debug("Leaving GetPendingTransaction")

	allPending := make([]*PendingTransaction, 3)

	for _, request := range h.pendingSignRequests {
		txStr, err := request.String()
		if err != nil {
			h.log.Error("failed to marshall sign request content", zap.Any("request", request))
			return nil
		}

		unmarshalled := &walletv1.SubmitTransactionRequest{}
		if err := jsonpb.UnmarshalString(txStr, unmarshalled); err != nil {
			return nil
		}

		currentPending := &PendingTransaction{
			PubKey:  unmarshalled.PubKey,
			Command: unmarshalled.String(),
			Hash:    request.TxHash(),
		}

		allPending = append(allPending, currentPending)
	}

	return &GetPendingTransactionsResponse{
		Transactions: allPending,
	}
}
