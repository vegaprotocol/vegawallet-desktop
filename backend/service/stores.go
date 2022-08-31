package service

import (
	"fmt"
	"sync"

	"code.vegaprotocol.io/vega/wallet/service"
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

func (rs *ConsentRequests) Range(f func(service.ConsentRequest) bool) {
	rs.storage.Range(func(rawTxID, rawConsentRequest interface{}) bool {
		consentRequest, ok := rawConsentRequest.(service.ConsentRequest)
		if !ok {
			panic(fmt.Sprintf("consent requests store doesn't contain a consent request: %v", rawConsentRequest))
		}
		return f(consentRequest)
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

func (ts *SentTransactions) Range(f func(service.SentTransaction) bool) {
	ts.storage.Range(func(rawTxID, rawSentTransaction interface{}) bool {
		sentTransaction, ok := rawSentTransaction.(service.SentTransaction)
		if !ok {
			panic(fmt.Sprintf("sent transaction store doesn't contain a sent transaction: %v", rawSentTransaction))
		}
		return f(sentTransaction)
	})
}

func (ts *SentTransactions) Store(req service.SentTransaction) {
	ts.storage.Store(req.TxID, req)
}

func (ts *SentTransactions) Delete(txID string) {
	ts.storage.Delete(txID)
}
