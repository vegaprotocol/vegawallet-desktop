package backend

import (
	"fmt"
	"sync"
	"time"

	"code.vegaprotocol.io/vegawallet/service"
	"github.com/golang/protobuf/jsonpb"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"go.uber.org/zap"
)

const (
	NewConsentRequestEvent = "new_consent_request"
	TransactionSentEvent   = "transaction_sent"
)

type ConsentRequests struct {
	storage sync.Map
}

func NewConsentRequests() *ConsentRequests {
	return &ConsentRequests{
		storage: sync.Map{},
	}
}

// Load return the ConsentRequest and true if found, return false otherwise.
func (rs *ConsentRequests) Load(txID string) (service.ConsentRequest, bool) {
	rawConsentRequest, ok := rs.storage.Load(txID)
	if !ok {
		return service.ConsentRequest{}, false
	}
	consentRequest, ok := rawConsentRequest.(service.ConsentRequest)
	if !ok {
		panic(fmt.Sprintf("consent requests store doesn't contain a consent request: %v", rawConsentRequest))
	}
	return consentRequest, true
}

func (rs *ConsentRequests) Range(f func(string, service.ConsentRequest) bool) {
	rs.storage.Range(func(rawTxID, rawConsentRequest interface{}) bool {
		consentRequest, ok := rawConsentRequest.(service.ConsentRequest)
		if !ok {
			panic(fmt.Sprintf("consent requests store doesn't contain a consent request: %v", rawConsentRequest))
		}
		return f(rawTxID.(string), consentRequest)
	})
}

func (rs *ConsentRequests) Store(req service.ConsentRequest) {
	rs.storage.Store(req.TxID, req)
}

func (rs *ConsentRequests) Delete(txID string) {
	rs.storage.Delete(txID)
}

type SentTransactions struct {
	storage sync.Map
}

func NewSentTransactions() *SentTransactions {
	return &SentTransactions{
		storage: sync.Map{},
	}
}

// Load return the SentTransaction and true if found, return false otherwise.
func (ts *SentTransactions) Load(txID string) (service.SentTransaction, bool) {
	rawSentTransaction, ok := ts.storage.Load(txID)
	if !ok {
		return service.SentTransaction{}, false
	}
	sentTransaction, ok := rawSentTransaction.(service.SentTransaction)
	if !ok {
		panic(fmt.Sprintf("sent transaction store doesn't contain a sent transaction: %v", rawSentTransaction))
	}
	return sentTransaction, true
}

func (ts *SentTransactions) Range(f func(string, service.SentTransaction) bool) {
	ts.storage.Range(func(rawTxID, rawSentTransaction interface{}) bool {
		sentTransaction, ok := rawSentTransaction.(service.SentTransaction)
		if !ok {
			panic(fmt.Sprintf("sent transaction store doesn't contain a sent transaction: %v", rawSentTransaction))
		}
		return f(rawTxID.(string), sentTransaction)
	})
}

func (ts *SentTransactions) Store(req service.SentTransaction) {
	ts.storage.Store(req.TxID, req)
}

func (ts *SentTransactions) Delete(txID string) {
	ts.storage.Delete(txID)
}

type ConsentRequest struct {
	TxID       string    `json:"txId"`
	Tx         string    `json:"tx"`
	ReceivedAt time.Time `json:"receivedAt"`
}

type SentTransaction struct {
	TxID         string    `json:"txId"`
	TxHash       string    `json:"txHash"`
	Tx           string    `json:"tx"`
	ReceivedAt   time.Time `json:"receivedAt"`
	Error        error     `json:"error"`
	ErrorDetails []string  `json:"errorDetails"`
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

	consentRequest, exists := h.consentRequests.Load(req.TxID)
	if !exists {
		return ErrConsentRequestNotFound
	}
	marshalledTx, err := consentRequest.String()
	if err != nil {
		h.log.Error("couldn't marshall transaction", zap.Any("request", consentRequest))
		return fmt.Errorf("couldn't marshall transaction: %w", err)
	}
	if req.Decision {
		h.log.Info("user approved transaction", zap.Any("transaction", consentRequest))
		consentRequest.Confirmations <- service.ConsentConfirmation{Decision: true, TxStr: marshalledTx}
	} else {
		h.log.Info("user declined transaction", zap.Any("transaction", consentRequest))
		consentRequest.Confirmations <- service.ConsentConfirmation{Decision: false, TxStr: marshalledTx}
	}
	close(consentRequest.Confirmations)

	h.consentRequests.Delete(req.TxID)
	return nil
}

func (h *Handler) GetConsentRequest(req *GetConsentRequestRequest) (*ConsentRequest, error) {
	h.log.Debug("Entering GetConsentRequest")
	defer h.log.Debug("Leaving GetConsentRequest")

	consentRequest, exists := h.consentRequests.Load(req.TxID)
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

	m := jsonpb.Marshaler{}

	consentRequests := []*ConsentRequest{}
	h.consentRequests.Range(func(txID string, consentRequest service.ConsentRequest) bool {
		marshaledTransaction, err := m.MarshalToString(consentRequest.Tx)
		if err != nil {
			panic("couldn't marshal transaction")
		}

		consentRequests = append(consentRequests, &ConsentRequest{
			Tx:         marshaledTransaction,
			TxID:       txID,
			ReceivedAt: consentRequest.ReceivedAt,
		})
		return true
	})

	return &ListConsentRequestsResponse{
		Requests: consentRequests,
	}, nil
}

func (h *Handler) ListSentTransactions() (*ListSentTransactionsResponse, error) {
	h.log.Debug("Entering ListSentTransactions")
	defer h.log.Debug("Leaving ListSentTransactions")

	m := jsonpb.Marshaler{}

	sentTransactions := []*SentTransaction{}
	h.sentTransactions.Range(func(txID string, sentTransaction service.SentTransaction) bool {
		marshaledTransaction, err := m.MarshalToString(sentTransaction.Tx)
		if err != nil {
			panic("couldn't marshal transaction")
		}

		sentTransactions = append(sentTransactions, &SentTransaction{
			TxID:         txID,
			TxHash:       sentTransaction.TxHash,
			Tx:           marshaledTransaction,
			ReceivedAt:   sentTransaction.ReceivedAt,
			Error:        sentTransaction.Error,
			ErrorDetails: sentTransaction.ErrorDetails,
		})
		return true
	})

	return &ListSentTransactionsResponse{
		Transactions: sentTransactions,
	}, nil
}

func (h *Handler) ClearSentTransaction(req *ClearSentTransactionRequest) error {
	h.log.Debug("Entering ClearSentTransaction")
	defer h.log.Debug("Leaving ClearSentTransaction")

	h.sentTransactions.Delete(req.TxID)
	return nil
}

func (h *Handler) emitTransactionSentEvent(sentTransaction service.SentTransaction) {
	h.log.Info(fmt.Sprintf("Received a \"transaction_sent\" event with ID: %s", sentTransaction.TxID))
	h.sentTransactions.Store(sentTransaction)
	go func() {
		m := jsonpb.Marshaler{}
		marshaledTransaction, err := m.MarshalToString(sentTransaction.Tx)
		if err != nil {
			panic("couldn't marshal transaction")
		}
		runtime.EventsEmit(h.ctx, TransactionSentEvent, &SentTransaction{
			TxID:         sentTransaction.TxID,
			TxHash:       sentTransaction.TxHash,
			Tx:           marshaledTransaction,
			ReceivedAt:   sentTransaction.ReceivedAt,
			Error:        sentTransaction.Error,
			ErrorDetails: sentTransaction.ErrorDetails,
		})
	}()
}

func (h *Handler) emitNewConsentRequestEvent(consentRequest service.ConsentRequest) {
	h.log.Info(fmt.Sprintf("Received a \"new_consent_request\" event with ID: %s", consentRequest.TxID))
	h.consentRequests.Store(consentRequest)
	go func() {
		m := jsonpb.Marshaler{}
		marshaledTransaction, err := m.MarshalToString(consentRequest.Tx)
		if err != nil {
			panic("couldn't marshal transaction")
		}
		runtime.EventsEmit(h.ctx, NewConsentRequestEvent, &ConsentRequest{
			TxID:       consentRequest.TxID,
			Tx:         marshaledTransaction,
			ReceivedAt: consentRequest.ReceivedAt,
		})
	}()
}
