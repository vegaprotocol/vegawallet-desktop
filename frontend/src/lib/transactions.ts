import omit from 'lodash/omit'

import type { RequestTransactionReview } from '../components/interaction-manager/types'

export enum TransactionStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export enum TransactionKeys {
  UNKNOWN = 'unknown',
  ORDER_SUBMISSION = 'orderSubmission',
  ORDER_CANCELLATION = 'orderCancellation',
  ORDER_AMENDMENT = 'orderAmendment',
  VOTE_SUBMISSION = 'voteSubmission',
  WITHDRAW_SUBMISSION = 'withdrawSubmission',
  LIQUIDTY_PROVISION_SUBMISSION = 'liquidityProvisionSubmission',
  LIQUIDTY_PROVISION_CANCELLATION = 'liquidityProvisionCancellation',
  LIQUIDITY_PROVISION_AMENDMENT = 'liquidityProvisionAmendment',
  PROPOSAL_SUBMISSION = 'proposalSubmission',
  ANNOUNCE_NODE = 'announceNode',
  NODE_VOTE = 'nodeVote',
  NODE_SIGNATURE = 'nodeSignature',
  CHAIN_EVENT = 'chainEvent',
  ORACLE_DATA_SUBMISSION = 'oracleDataSubmission',
  UNDELEGATE_SUBMISSION = 'undelegateSubmission',
  DELEGATE_SUBMISSION = 'delegateSubmission',
  TRANSFER = 'transfer',
  CANCEL_TRANSFER = 'cancelTransfer',
  KEY_ROTATE_SUBMISSION = 'keyRotateSubmission',
  ETHEREUM_KEY_ROTATE_SUBMISSION = 'ethereumKeyRotateSubmission'
}

type TransactionData = object

export type Transaction = {
  id: string
  type: TransactionKeys
  hostname: string
  wallet: string
  publicKey: string
  payload: TransactionData
  status: TransactionStatus
  receivedAt: Date
  txHash?: null | string
  blockHeight?: number
  signature?: string
  error?: string
}

const getPayload = (transaction: string): TransactionData => {
  try {
    return JSON.parse(transaction)
  } catch (err) {
    throw new Error('Could not parse transaction payload')
  }
}

const getType = (payload: object) => {
  return Object.keys(
    omit(payload, ['blockHeight', 'nonce'])
  )[0] as TransactionKeys
}

export const parseTransactionInput = (
  event: RequestTransactionReview
): Transaction => {
  const payload = getPayload(event.data.transaction)
  const type = getType(payload)

  return {
    id: event.traceID,
    type,
    payload,
    status: TransactionStatus.PENDING,
    hostname: event.data.hostname,
    receivedAt: new Date(event.data.receivedAt),
    wallet: event.data.wallet,
    publicKey: event.data.publicKey,
    txHash: null
  }
}

export const sortTransaction = (a: Transaction, b: Transaction) => {
  if (a.receivedAt < b.receivedAt) return -1
  if (a.receivedAt > b.receivedAt) return 1
  return 0
}
