import * as Sentry from '@sentry/react'
import * as React from 'react'

import { NEW_CONSENT_REQUEST } from '../../lib/events'
import { Service } from '../../service'
import type { ConsentRequest } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

export interface ParsedTx {
  txId: string
  tx: object
  type: string
  receivedAt: Date
  pubKey: string
}

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<ParsedTx[]>([])

  const handleResponse = React.useCallback(
    async (txId: string, decision: boolean) => {
      try {
        await Service.ConsentToTransaction({
          txId,
          decision
        })
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

    window.runtime.EventsOn(NEW_CONSENT_REQUEST, (tx: ConsentRequest) => {
      setTransactions(curr => [...curr, parseTx(tx)])
    })

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

const parseTx = (consentRequest: ConsentRequest): ParsedTx => {
  let payload

  try {
    payload = JSON.parse(consentRequest.tx)
  } catch (err) {
    throw new Error('Could not parse transaction payload')
  }

  const result = {
    txId: consentRequest.txId,
    receivedAt: new Date(consentRequest.receivedAt as string),
    tx: {},
    type: 'Unknown transaction',
    pubKey: ''
  }

  if (
    payload !== null &&
    payload !== undefined &&
    typeof payload === 'object'
  ) {
    result.pubKey = payload.pubKey

    if ('orderSubmission' in payload) {
      result.type = 'Order submission'
      result.tx = payload.orderSubmission
    } else if ('withdrawSubmission' in payload) {
      result.type = 'Withdrawal submission'
      result.tx = payload.withdrawSubmission
    } else if ('voteSubmission' in payload) {
      result.type = 'Vote submission'
      result.tx = payload.voteSubmission
    } else if ('delegateSubmission' in payload) {
      result.type = 'Delegate submission'
      result.tx = payload.delegateSubmission
    } else if ('undelegateSubmission' in payload) {
      result.type = 'Undelegate submission'
      result.tx = payload.undelegateSubmission
    } else {
      result.type = 'Unknown transaction'
      result.tx = payload
    }
  }

  return result
}
