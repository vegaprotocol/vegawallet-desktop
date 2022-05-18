import * as Sentry from '@sentry/react'
import * as React from 'react'

import { NEW_CONSENT_REQUEST } from '../../lib/events'
import { Service } from '../../service'
import type { ConsentRequest } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

export type Tx = Pick<ConsentRequest, 'txId' | 'tx' | 'receivedAt'>

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<Tx[]>([])

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
        setTransactions(res.requests)
      } catch (err) {
        Sentry.captureException(err)
      }
    }

    window.runtime.EventsOn(NEW_CONSENT_REQUEST, (tx: Tx) => {
      setTransactions(curr => [...curr, tx])
    })

    run()
  }, [])

  return (
    <TransactionModal transactions={transactions} onRespond={handleResponse} />
  )
}
