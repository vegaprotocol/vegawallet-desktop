import type { RequestTransactionSendingContent } from '../components/interaction-manager/types'

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

export type Transaction = RequestTransactionSendingContent & {
  type: TransactionKeys
  payload: object
  decision?: boolean
}

const getPayload = (transaction: string): object => {
  try {
    return JSON.parse(transaction)
  } catch (err) {
    throw new Error('Could not parse transaction payload')
  }
}

const getType = (payload: object) => {
  return Object.keys(payload)[0] as TransactionKeys
}

export const parseTransaction = (data: RequestTransactionSendingContent) => {
  const payload = getPayload(data.transaction)
  const type = getType(payload)

  return {
    ...data,
    type,
    payload
  }
}
