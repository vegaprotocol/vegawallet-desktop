// import type { backend as BackendModel } from '../wailsjs/go/models'

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

const TRANSACTION_TITLES: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'Unknown transaction',
  [TransactionKeys.ORDER_SUBMISSION]: 'Order submission',
  [TransactionKeys.ORDER_CANCELLATION]: 'Order cancellation',
  [TransactionKeys.ORDER_AMENDMENT]: 'Order amendment',
  [TransactionKeys.VOTE_SUBMISSION]: 'Vote submission',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'Withdraw submission',
  [TransactionKeys.LIQUIDTY_PROVISION_SUBMISSION]: 'Liquidity provision',
  [TransactionKeys.LIQUIDTY_PROVISION_CANCELLATION]:
    'Liquidity provision cancellation',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]:
    'Liquidity provision amendment',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'Proposal submission',
  [TransactionKeys.ANNOUNCE_NODE]: 'Announce node',
  [TransactionKeys.NODE_VOTE]: 'Node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'Node signature',
  [TransactionKeys.CHAIN_EVENT]: 'Chain event',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'Oracle data submission',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'Undelegate submission',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'Delegate submission',
  [TransactionKeys.TRANSFER]: 'Transfer',
  [TransactionKeys.CANCEL_TRANSFER]: 'Cancel transfer',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'Key rotation submission',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]:
    'Ethereum key rotation submission'
}

// export interface Transaction {
//   txId: string // signature
//   tx: object // payload
//   txHash: string | null
//   type: TransactionKeys
//   receivedAt: Date
//   pubKey: string
//   pending: boolean
//   sentAt: Date | null
//   error: string | null
// }
//
// /**
//  * Parses a raw consent request object into a more usable object where the transaction
//  * payload has been turned from a json string into an object and we have determined
//  * what kind of transaction it is
//  */
// export const parseTx = (
//   consentRequest: BackendModel.ConsentRequest
// ): Transaction => {
//   let payload: { pubKey: string; propagate: boolean }
//
//   try {
//     payload = JSON.parse(consentRequest.tx)
//   } catch (err) {
//     throw new Error('Could not parse transaction payload')
//   }
//
//   const result: Transaction = {
//     txId: consentRequest.txId,
//     receivedAt: new Date(consentRequest.receivedAt as string),
//     tx: {},
//     type: TransactionKeys.UNKNOWN,
//     pubKey: '',
//     pending: false,
//     txHash: null,
//     sentAt: null,
//     error: null
//   }
//
//   if (
//     payload !== null &&
//     payload !== undefined &&
//     typeof payload === 'object'
//   ) {
//     result.pubKey = payload.pubKey
//
//     for (const key in payload) {
//       if (Object.values(TransactionKeys).indexOf(key as TransactionKeys) > -1) {
//         result.type = key as TransactionKeys
//         // @ts-ignore doesnt appear to be a good way to type this without defining
//         // interfaces for every single transaction
//         result.tx = payload[key]
//       }
//     }
//
//     return result
//   } else {
//     throw new Error('Invalid payload')
//   }
// }

export type Transaction = RequestTransactionSendingContent & {
  type: TransactionKeys
  payload: object
  title: string
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
    payload,
    title: TRANSACTION_TITLES[type]
  }
}
