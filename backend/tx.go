package backend

import (
	"fmt"
	"time"

	"code.vegaprotocol.io/vega/wallet/api/interactor"
	"code.vegaprotocol.io/vega/wallet/service"
	"github.com/golang/protobuf/jsonpb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const NewInteractionEvent = "new_interaction"

func (h *Handler) RespondToInteraction(interaction interactor.Interaction) error {
	h.log.Debug("Entering RespondToInteraction")
	defer h.log.Debug("Leaving RespondToInteraction")

	if h.ctx.Err() != nil {
		return ErrContextCanceled
	}

	h.service.ResponseChan <- interaction

	return nil
}

func (h *Handler) emitReceivedInteraction(interaction interactor.Interaction) {
	h.log.Info(fmt.Sprintf("Received a new interaction %q with trace ID %q", interaction.Name, interaction.TraceID))
	runtime.EventsEmit(h.ctx, NewInteractionEvent, interaction)
}

// API v1.
const (
	NewConsentRequestEvent = "new_consent_request"
	TransactionSentEvent   = "transaction_sent"
)

type ConsentRequest struct {
	TxID       string    `json:"txId"`
	Tx         string    `json:"tx"`
	ReceivedAt time.Time `json:"receivedAt"`
}

type SentTransaction struct {
	TxID   string    `json:"txId"`
	TxHash string    `json:"txHash"`
	Tx     string    `json:"tx"`
	SentAt time.Time `json:"sentAt"`
	Error  string    `json:"error"`
}

type ConsentToTransactionRequest struct {
	TxID     string `json:"txId"`
	Decision bool   `json:"decision"`
}

type ClearSentTransactionRequest struct {
	TxID string `json:"txId"`
}

type GetConsentRequestRequest struct {
	TxID string `json:"txId"`
}

type ListConsentRequestsResponse struct {
	Requests []*ConsentRequest `json:"requests"`
}

type ListSentTransactionsResponse struct {
	Transactions []*SentTransaction `json:"transactions"`
}

func (h *Handler) ConsentToTransaction(req *ConsentToTransactionRequest) error {
	h.log.Debug("Entering ConsentToTransaction")
	defer h.log.Debug("Leaving ConsentToTransaction")

	consentRequest, exists := h.service.ConsentRequests.Load(req.TxID)
	if !exists {
		return ErrConsentRequestNotFound
	}
	if req.Decision {
		h.log.Info("user approved transaction", zap.Any("transaction", consentRequest))
		consentRequest.Confirmation <- service.ConsentConfirmation{Decision: true}
	} else {
		h.log.Info("user declined transaction", zap.Any("transaction", consentRequest))
		consentRequest.Confirmation <- service.ConsentConfirmation{Decision: false}
	}

	h.service.ConsentRequests.Delete(req.TxID)
	return nil
}

func (h *Handler) GetConsentRequest(req *GetConsentRequestRequest) (*ConsentRequest, error) {
	h.log.Debug("Entering GetConsentRequest")
	defer h.log.Debug("Leaving GetConsentRequest")

	consentRequest, exists := h.service.ConsentRequests.Load(req.TxID)
	if !exists {
		return nil, ErrTransactionNotFound
	}

	m := jsonpb.Marshaler{}
	marshaledTransaction, err := m.MarshalToString(consentRequest.Tx)
	if err != nil {
		panic("couldn't marshal transaction")
	}

	return &ConsentRequest{
		Tx:         marshaledTransaction,
		TxID:       consentRequest.TxID,
		ReceivedAt: consentRequest.ReceivedAt,
	}, nil
}

func (h *Handler) ListConsentRequests() (*ListConsentRequestsResponse, error) {
	h.log.Debug("Entering ListConsentRequests")
	defer h.log.Debug("Leaving ListConsentRequests")

	consentRequests := []*ConsentRequest{}
	h.service.ConsentRequests.Range(func(consentRequest service.ConsentRequest) bool {
		req, _ := toSerializableConsentRequest(consentRequest)
		consentRequests = append(consentRequests, req)
		return true
	})

	return &ListConsentRequestsResponse{
		Requests: consentRequests,
	}, nil
}

func (h *Handler) ListSentTransactions() (*ListSentTransactionsResponse, error) {
	h.log.Debug("Entering ListSentTransactions")
	defer h.log.Debug("Leaving ListSentTransactions")

	sentTransactions := []*SentTransaction{}
	h.service.SentTransactions.Range(func(sentTransaction service.SentTransaction) bool {
		req, _ := toSerializableSentTransaction(sentTransaction)
		sentTransactions = append(sentTransactions, req)
		return true
	})

	return &ListSentTransactionsResponse{
		Transactions: sentTransactions,
	}, nil
}

func (h *Handler) ClearSentTransaction(req *ClearSentTransactionRequest) error {
	h.log.Debug("Entering ClearSentTransaction")
	defer h.log.Debug("Leaving ClearSentTransaction")

	h.service.SentTransactions.Delete(req.TxID)
	return nil
}

func (h *Handler) emitTransactionSentEvent(sentTransaction service.SentTransaction) {
	h.log.Info(fmt.Sprintf("Received a \"transaction_sent\" event with ID: %s", sentTransaction.TxID))
	h.service.SentTransactions.Store(sentTransaction)
	go func() {
		req, err := toSerializableSentTransaction(sentTransaction)
		if err != nil {
			h.log.Error("couldn't serialize sent transaction for event", zap.Error(err))
		}
		runtime.EventsEmit(h.ctx, TransactionSentEvent, req)
	}()
}

func (h *Handler) emitNewConsentRequestEvent(consentRequest service.ConsentRequest) {
	h.log.Info(fmt.Sprintf("Received a \"new_consent_request\" event with ID: %s", consentRequest.TxID))
	h.service.ConsentRequests.Store(consentRequest)
	go func() {
		req, err := toSerializableConsentRequest(consentRequest)
		if err != nil {
			h.log.Error("couldn't serialize consent request for event", zap.Error(err))
		}
		runtime.EventsEmit(h.ctx, NewConsentRequestEvent, req)
	}()
}

func toSerializableConsentRequest(consentRequest service.ConsentRequest) (*ConsentRequest, error) {
	m := jsonpb.Marshaler{}
	marshaledTransaction, err := m.MarshalToString(consentRequest.Tx)
	if err != nil {
		return nil, fmt.Errorf("couldn't marshal transaction: %w", err)
	}

	return &ConsentRequest{
		TxID:       consentRequest.TxID,
		Tx:         marshaledTransaction,
		ReceivedAt: consentRequest.ReceivedAt,
	}, nil
}

func toSerializableSentTransaction(sentTransaction service.SentTransaction) (*SentTransaction, error) {
	m := jsonpb.Marshaler{}
	var marshaledTransaction string
	if sentTransaction.Tx != nil {
		m, err := m.MarshalToString(sentTransaction.Tx)
		if err != nil {
			return nil, fmt.Errorf("couldn't marshal transaction: %w", err)
		}
		marshaledTransaction = m
	}

	serializableSentTransaction := &SentTransaction{
		TxID:   sentTransaction.TxID,
		TxHash: sentTransaction.TxHash,
		Tx:     marshaledTransaction,
		SentAt: sentTransaction.SentAt,
	}

	if sentTransaction.Error != nil {
		serializableSentTransaction.Error = sentTransaction.Error.Error()
	}

	return serializableSentTransaction, nil
}
