import * as React from 'react'

import { Service } from '../../service'
import type { ConsentRequest } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

export type TransactionsState = {
  [id: string]: ConsentRequest
}

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<TransactionsState>({})

  const handleResponse = React.useCallback(
    async (txId: string, decision: boolean) => {
      try {
        const res = await Service.ConsentToTransaction({
          txId,
          decision
        })
        console.log('ConsentToTransaction successful', res)
      } catch (err) {
        console.log('ConsentToTransaction failed')
        console.error(err)
      }
    },
    []
  )

  // Mount listener for incoming transactions
  React.useEffect(() => {
    console.log('binding new_consent_request event')
    window.runtime.EventsOn('new_consent_request', (txId: string) => {
      console.log('new_consent_request event', txId)
      // TODO:
      // setTransactions()
    })
  }, [])

  // Get any already pending tx on startup
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await Service.ListConsentRequests()
        console.log('ListConsentRequests success', res)
        // TODO:
        // setTransactions()
      } catch (err) {
        console.log('ListConsentRequests failed')
        console.error(err)
      }
    }

    run()
  }, [])

  return (
    <TransactionModal transactions={transactions} onRespond={handleResponse} />
  )
}
