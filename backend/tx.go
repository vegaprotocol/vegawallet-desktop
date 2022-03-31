package backend

const NewPendingTxEvent = "new_pending_transaction"

type PendingTransaction struct {
	PubKey  string `json:"pubKey"`
	Command string `json:"command"`
}

type ConsentPendingTransactionRequest struct {
	Hash     string `json:"hash"`
	Decision bool   `json:"decision"`
}

func (h *Handler) ConsentPendingTransaction(req *ConsentPendingTransactionRequest) error {
	return nil
}

type GetPendingTransactionRequest struct {
	Hash string `json:"hash"`
}

func (h *Handler) GetPendingTransaction(req *GetPendingTransactionRequest) (*PendingTransaction, error) {
	return nil, nil
}

type GetPendingTransactionsResponse struct {
	Transactions []*PendingTransaction `json:"transactions"`
}

func (h *Handler) GetPendingTransactions() *GetPendingTransactionsResponse {
	return &GetPendingTransactionsResponse{
		Transactions: []*PendingTransaction{},
	}
}
