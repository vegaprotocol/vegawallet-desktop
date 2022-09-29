import type { backend as BackendModel } from '../wailsjs/go/models'

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

export interface ParsedTx {
  txId: string // signature
  tx: object // payload
  txHash: string | null
  type: TransactionKeys
  receivedAt: Date
  pubKey: string
  pending: boolean
  sentAt: Date | null
  error: string | null
}

/**
 * Parses a raw consent request object into a more usable object where the transaction
 * payload has been turned from a json string into an object and we have determined
 * what kind of transaction it is
 */
export const parseTx = (
  consentRequest: BackendModel.ConsentRequest
): ParsedTx => {
  let payload: { pubKey: string; propagate: boolean }

  try {
    payload = JSON.parse(consentRequest.tx)
  } catch (err) {
    throw new Error('Could not parse transaction payload')
  }

  const result: ParsedTx = {
    txId: consentRequest.txId,
    receivedAt: new Date(consentRequest.receivedAt as string),
    tx: {},
    type: TransactionKeys.UNKNOWN,
    pubKey: '',
    pending: false,
    txHash: null,
    sentAt: null,
    error: null
  }

  if (
    payload !== null &&
    payload !== undefined &&
    typeof payload === 'object'
  ) {
    result.pubKey = payload.pubKey

    for (const key in payload) {
      if (Object.values(TransactionKeys).indexOf(key as TransactionKeys) > -1) {
        result.type = key as TransactionKeys
        // @ts-ignore doesnt appear to be a good way to type this without defining
        // interfaces for every single transaction
        result.tx = payload[key]
      }
    }

    return result
  } else {
    throw new Error('Invalid payload')
  }
}
