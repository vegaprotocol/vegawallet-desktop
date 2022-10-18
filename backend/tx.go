package backend

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"code.vegaprotocol.io/vega/wallet/api/interactor"
	"code.vegaprotocol.io/vega/wallet/service"
	"code.vegaprotocol.io/vegawallet-desktop/app"
	"code.vegaprotocol.io/vegawallet-desktop/os"
	"github.com/golang/protobuf/jsonpb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const NewInteractionEvent = "new_interaction"

var (
	ErrTraceIDIsRequired = errors.New("a trace ID is required for an interaction")
	ErrNameIsRequired    = errors.New("a name is required for an interaction")
)

func (h *Handler) RespondToInteraction(interaction interactor.Interaction) error {
	h.log.Debug("Entering RespondToInteraction")
	defer h.log.Debug("Leaving RespondToInteraction")

	if interaction.TraceID == "" {
		return ErrTraceIDIsRequired
	}

	if interaction.Name == "" {
		return ErrNameIsRequired
	}

	h.log.Debug(fmt.Sprintf("Received a response %q with trace ID %q", interaction.Name, interaction.TraceID))

	if h.ctx.Err() != nil {
		return ErrContextCanceled
	}

	h.service.ResponseChan <- interaction

	return nil
}

func (h *Handler) emitReceivedInteraction(log *zap.Logger, interaction interactor.Interaction) {
	log.Debug(fmt.Sprintf("Received a new interaction %q with trace ID %q", interaction.Name, interaction.TraceID))

	if shouldEmitOSNotification(interaction.Name) {
		message := strings.ToLower(strings.ReplaceAll(string(interaction.Name), "_", " "))
		if err := os.Notify(app.Name, message); err != nil {
			log.Warn("Could not send the OS notification", zap.Error(err))
		}
	}

	runtime.EventsEmit(h.ctx, NewInteractionEvent, interaction)
}

func shouldEmitOSNotification(interactionName interactor.InteractionName) bool {
	return !(interactionName == interactor.LogName ||
		interactionName == interactor.InteractionSessionBeganName ||
		interactionName == interactor.InteractionSessionEndedName)
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

func (h *Handler) emitTransactionSentEvent(log *zap.Logger, sentTransaction service.SentTransaction) {
	log.Info(fmt.Sprintf("Received a \"transaction_sent\" event with ID: %s", sentTransaction.TxID))
	h.service.SentTransactions.Store(sentTransaction)
	go func() {
		req, err := toSerializableSentTransaction(sentTransaction)
		if err != nil {
			log.Error("couldn't serialize sent transaction for event", zap.Error(err))
		}
		runtime.EventsEmit(h.ctx, TransactionSentEvent, req)
	}()
}

func (h *Handler) emitNewConsentRequestEvent(log *zap.Logger, consentRequest service.ConsentRequest) {
	log.Info(fmt.Sprintf("Received a \"new_consent_request\" event with ID: %s", consentRequest.TxID))
	h.service.ConsentRequests.Store(consentRequest)
	go func() {
		req, err := toSerializableConsentRequest(consentRequest)
		if err != nil {
			log.Error("couldn't serialize consent request for event", zap.Error(err))
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
