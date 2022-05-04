package backend

import (
	"fmt"
	"time"

	walletv1 "code.vegaprotocol.io/protos/vega/wallet/v1"
	"code.vegaprotocol.io/vegawallet/service"
	"github.com/golang/protobuf/jsonpb"
	"go.uber.org/zap"
)

const NewPendingTxEvent = "new_pending_transaction"
const NewSentTxEvent = "new_sent_transaction"

type PendingTransaction struct {
	TxID       string    `json:"txId""`
	PubKey     string    `json:"pubKey"`
	Command    string    `json:"command"`
	ReceivedAt time.Time `json:"receivedAt"`
}

type ApprovedTransaction struct {
	TxID       string    `json:"txId""`
	PubKey     string    `json:"pubKey"`
	Command    string    `json:"command"`
	ReceivedAt time.Time `json:"receivedAt"`
	ApprovedAt time.Time `json:"approvedAt"`
}

type ConsentPendingTransactionRequest struct {
	TxID     string `json:"txId"`
	Decision bool   `json:"decision"`
}

type ClearApprovedTransactionRequest struct {
	TxID string `json:"txId"`
}

type GetPendingTransactionRequest struct {
	TxID string `json:"txId"`
}

type GetPendingTransactionsResponse struct {
	Transactions []*PendingTransaction `json:"transactions"`
}

type GetApprovedTransactionsResponse struct {
	Transactions []*ApprovedTransaction `json:"transactions"`
}

func (h *Handler) ConsentPendingTransaction(req *ConsentPendingTransactionRequest) error {
	h.log.Debug("Entering ConsentPendingTransaction")
	defer h.log.Debug("Leaving ConsentPendingTransaction")

	rawSignRequest, ok := h.pendingSignRequests.Load(req.TxID)
	if !ok {
		h.log.Error("failed to find transaction", zap.Any("request", req))
		return fmt.Errorf("transaction not found")
	}
	signRequest := rawSignRequest.(service.ConsentRequest)
	txStr, err := signRequest.String()
	if err != nil {
		h.log.Error("failed to marshall sign request content", zap.Any("request", signRequest))
		return err
	}
	if req.Decision {
		h.log.Info("user approved sign request for transaction", zap.Any("transaction", signRequest))
		signRequest.Confirmations <- service.ConsentConfirmation{Decision: true, TxStr: txStr}
		unmarshalled := &walletv1.SubmitTransactionRequest{}
		if err := jsonpb.UnmarshalString(txStr, unmarshalled); err != nil {
			h.log.Error("failed to unmarshall request content", zap.String("tx", txStr), zap.Error(err))
			return ErrCouldNotDecodeTransaction
		}

		approvedTx := &ApprovedTransaction{
			PubKey:     unmarshalled.PubKey,
			Command:    unmarshalled.String(),
			TxID:       req.TxID,
			ReceivedAt: signRequest.ReceivedAt,
			ApprovedAt: time.Now(),
		}
		h.approvedSignRequests.Store(req.TxID, approvedTx)

	} else {
		h.log.Info("user declined sign request for transaction", zap.Any("transaction", signRequest))
		signRequest.Confirmations <- service.ConsentConfirmation{Decision: false, TxStr: txStr}
	}
	close(signRequest.Confirmations)

	h.pendingSignRequests.Delete(req.TxID)
	return nil
}

func (h *Handler) GetPendingTransaction(req *GetPendingTransactionRequest) (*PendingTransaction, error) {
	h.log.Debug("Entering GetPendingTransaction")
	defer h.log.Debug("Leaving GetPendingTransaction")

	rawSignRequest, ok := h.pendingSignRequests.Load(req.TxID)
	if !ok {
		h.log.Error("failed to find transaction", zap.Any("request", req))
		return nil, ErrTransactionNotFound
	}
	consentRequest := rawSignRequest.(service.ConsentRequest)
	txStr, err := consentRequest.String()
	if err != nil {
		h.log.Error("failed to get sign request content", zap.Any("request", consentRequest), zap.Error(err))
		return nil, ErrCouldNotGetTransactionConsent
	}

	unmarshalled := &walletv1.SubmitTransactionRequest{}
	if err := jsonpb.UnmarshalString(txStr, unmarshalled); err != nil {
		h.log.Error("failed to unmarshall request content", zap.String("tx", txStr), zap.Error(err))
		return nil, ErrCouldNotDecodeTransaction
	}

	return &PendingTransaction{
		PubKey:  unmarshalled.PubKey,
		Command: unmarshalled.String(),
		TxID:    consentRequest.TxID,
	}, nil
}

func (h *Handler) GetPendingTransactions() (*GetPendingTransactionsResponse, error) {
	h.log.Debug("Entering GetPendingTransaction")
	defer h.log.Debug("Leaving GetPendingTransaction")

	allPending := make([]*PendingTransaction, 3)

	var err error
	h.pendingSignRequests.Range(func(rawId, rawConsentRequest interface{}) bool {
		var txStr string
		signRequest := rawConsentRequest.(service.ConsentRequest)
		txStr, err = signRequest.String()
		if err != nil {
			h.log.Error("failed to get sign request content", zap.Any("request", signRequest), zap.Error(err))
			return false
		}

		unmarshalled := &walletv1.SubmitTransactionRequest{}
		if err = jsonpb.UnmarshalString(txStr, unmarshalled); err != nil {
			h.log.Error("failed to unmarshall request content", zap.String("tx", txStr), zap.Error(err))
			return false
		}

		txtxId := rawId.(string)
		currentPending := &PendingTransaction{
			PubKey:  unmarshalled.PubKey,
			Command: unmarshalled.String(),
			TxID:    txtxId,
		}

		allPending = append(allPending, currentPending)
		return true
	})
	if err != nil {
		return nil, ErrCouldNotListTransactions
	}

	return &GetPendingTransactionsResponse{
		Transactions: allPending,
	}, nil
}

func (h *Handler) GetApprovedTransactions() (*GetApprovedTransactionsResponse, error) {
	h.log.Debug("Entering GetApprovedTransaction")
	defer h.log.Debug("Leaving GetApprovedTransaction")

	allApproved := make([]*ApprovedTransaction, 3)

	var err error
	h.approvedSignRequests.Range(func(rawId, rawTx interface{}) bool {
		approvedTx := rawTx.(ApprovedTransaction)
		allApproved = append(allApproved, &approvedTx)
		return true
	})
	if err != nil {
		return nil, ErrCouldNotListTransactions
	}

	return &GetApprovedTransactionsResponse{
		Transactions: allApproved,
	}, nil
}

func (h *Handler) ClearApprovedTransaction(req *ClearApprovedTransactionRequest) error {
	h.log.Debug("Entering ClearApprovedTransaction")
	defer h.log.Debug("Leaving ClearApprovedTransaction")

	h.approvedSignRequests.Delete(req.TxID)
	return nil
}
