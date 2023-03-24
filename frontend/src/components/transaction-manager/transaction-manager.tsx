import * as React from 'react'

import {Intent} from '../../config/intent'
import {events} from '../../lib/events'
import {createLogger} from '../../lib/logging'
import {Service} from '../../service'
import {backend} from '../../wailsjs/go/models'
import {AppToaster} from '../toaster'
import {TransactionModal} from '../transaction-modal'
import type {ParsedTx} from './transaction-types'
import {TransactionKeys} from './transaction-types'
import {EventsOn} from '../../wailsjs/runtime'

const logger = createLogger('TransactionManager')

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
        AppToaster.show({
          message: `Something went wrong ${
            decision ? 'approving' : 'rejecting'
          } transaction: ${txId}`,
          intent: Intent.DANGER
        })
        logger.error(err)
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
        AppToaster.show({
          message: 'Something went wrong retrieving pending transactions',
          intent: Intent.DANGER,
          timeout: 0
        })
        logger.error(err)
      }
    }

    // Listen for new incoming transactions
    EventsOn(
      events.NEW_CONSENT_REQUEST,
      (tx: backend.ConsentRequest) => {
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
const parseTx = (consentRequest: backend.ConsentRequest): ParsedTx => {
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
    pubKey: ''
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
