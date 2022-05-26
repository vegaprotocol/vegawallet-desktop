import * as Sentry from '@sentry/react'
import * as React from 'react'

import { events } from '../../lib/events'
import { Service } from '../../service'
import type { ConsentRequest } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'
import type {
  ParsedTx,
  Transaction,
  TransactionPayload
} from './transaction-types'

/**
 * Stores an array of parsed transactions which get passed to a modal
 */
export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<ParsedTx[]>([])

  const handleResponse = React.useCallback(
    async (txId: string, decision: boolean) => {
      try {
        await Service.ConsentToTransaction({
          txId,
          decision
        })

        // Remove the rejected/approved transaction
        setTransactions(curr => curr.filter(tx => tx.txId !== txId))
      } catch (err) {
        Sentry.captureException(err)
      }
    },
    []
  )

  // Get any already pending tx on startup
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await Service.ListConsentRequests()
        setTransactions(res.requests.map(parseTx))
      } catch (err) {
        Sentry.captureException(err)
      }
    }

    // Listen for new incoming transactions
    window.runtime.EventsOn(
      events.NEW_CONSENT_REQUEST,
      (tx: ConsentRequest) => {
        setTransactions(curr => [...curr, parseTx(tx)])
      }
    )

    run()
  }, [])

  const orderedTransactions = React.useMemo(() => {
    if (!transactions.length) {
      return []
    }

    // Oldest at index 0
    return transactions.sort((a, b) => {
      return a.receivedAt.getTime() - b.receivedAt.getTime()
    })
  }, [transactions])

  return (
    <TransactionModal
      transactions={orderedTransactions}
      onRespond={handleResponse}
    />
  )
}

/**
 * Parses a raw consent request object into a more usable object where the transaction
 * payload has been turned from a json string into an object and we have determined
 * what kind of transaction it is
 */
const parseTx = (consentRequest: ConsentRequest): ParsedTx => {
  let payload: Transaction

  try {
    payload = JSON.parse(consentRequest.tx)
  } catch (err) {
    throw new Error('Could not parse transaction payload')
  }

  const result: ParsedTx = {
    txId: consentRequest.txId,
    receivedAt: new Date(consentRequest.receivedAt as string),
    tx: {} as TransactionPayload,
    type: 'unknown',
    pubKey: ''
  }

  if (
    payload !== null &&
    payload !== undefined &&
    typeof payload === 'object'
  ) {
    result.pubKey = payload.pubKey

    if ('orderSubmission' in payload) {
      result.type = 'orderSubmission'
      result.tx = payload.orderSubmission
    } else if ('withdrawSubmission' in payload) {
      result.type = 'withdrawSubmission'
      result.tx = payload.withdrawSubmission
    } else if ('voteSubmission' in payload) {
      result.type = 'voteSubmission'
      result.tx = payload.voteSubmission
    } else if ('delegateSubmission' in payload) {
      result.type = 'delegateSubmission'
      result.tx = payload.delegateSubmission
    } else if ('undelegateSubmission' in payload) {
      result.type = 'undelegateSubmission'
      result.tx = payload.undelegateSubmission
    } else {
      result.type = 'unknown'
      result.tx = payload
    }

    return result
  } else {
    throw new Error('Invalid payload')
  }
}
