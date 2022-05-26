export type TransactionType =
  | 'unknown'
  | 'orderSubmission'
  | 'withdrawSubmission'
  | 'voteSubmission'
  | 'delegateSubmission'
  | 'undelegateSubmission'

interface BaseTransaction {
  pubKey: string
  propagate: boolean
}

export interface OrderTransactionPayload {
  marketId: string
  type: 'TYPE_MARKET'
  size: string
  side: 'SIDE_BUY'
  timeInForce:
    | 'TIME_IN_FORCE_IOC'
    | 'TIME_IN_FORCE_FOK'
    | 'TIME_IN_FORCE_GTT'
    | 'TIME_IN_FORCE_GTC'
    | 'TIME_IN_FORCE_GFN'
    | 'TIME_IN_FORCE_GFA'
  price?: string
  reference?: string
  expiresAt?: string
}

export interface OrderTransaction extends BaseTransaction {
  orderSubmission: OrderTransactionPayload
}

export interface WithdrawTransactionPayload {
  amount: string
  asset: string
  ext: {
    erc20: {
      receiverAddress: string
    }
  }
}

export interface WithdrawTransaction extends BaseTransaction {
  withdrawSubmission: WithdrawTransactionPayload
}

export interface VoteTransactionPayload {
  proposalId: string
  value: 'VALUE_YES' | 'VALUE_NO'
}

export interface VoteTransaction extends BaseTransaction {
  voteSubmission: VoteTransactionPayload
}

export interface DelegateTransactionPayload {
  nodeId: string
  amount: string
}

export interface DelegateTransaction extends BaseTransaction {
  delegateSubmission: DelegateTransactionPayload
}

export interface UndelegateTransactionPayload {
  nodeId: string
  amount: string
  method: 'METHOD_NOW' | 'METHOD_AT_END_OF_EPOCH'
}

export interface UndelegateTransaction extends BaseTransaction {
  undelegateSubmission: UndelegateTransactionPayload
}

export type TransactionPayload =
  | OrderTransactionPayload
  | WithdrawTransactionPayload
  | VoteTransactionPayload
  | DelegateTransactionPayload
  | UndelegateTransactionPayload

export type Transaction =
  | OrderTransaction
  | WithdrawTransaction
  | VoteTransaction
  | DelegateTransaction
  | UndelegateTransaction

export interface ParsedTx {
  txId: string
  tx: TransactionPayload
  type: TransactionType
  receivedAt: Date
  pubKey: string
}
