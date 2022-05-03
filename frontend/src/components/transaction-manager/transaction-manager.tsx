import * as React from 'react'

import { Service } from '../../service'
import type { PendingTransaction } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

export type TransactionsState = {
  [id: string]: PendingTransaction
}

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<TransactionsState>({})

  const handleResponse = React.useCallback(
    async (txId: string, decision: boolean) => {
      try {
        const res = await Service.ConsentPendingTransaction({
          txId,
          decision
        })
        console.log('ConsentPendingTransaction successful', res)
      } catch (err) {
        console.log('ConsentPendingTransaction failed')
        console.error(err)
      }
    },
    []
  )

  // Mount listener for incoming transactions
  React.useEffect(() => {
    window.runtime.EventsOn('new_pending_transaction', (txId: string) => {
      console.log('new_pending_transaction event', txId)
      // TODO:
      // setTransactions()
    })
  }, [])

  // Get any already pending tx on startup
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await Service.GetPendingTransactions()
        console.log('GetPendingTransactions success', res)
        // TODO:
        // setTransactions()
      } catch (err) {
        console.log('GetPendingTransactions failed')
        console.error(err)
      }
    }

    run()
  }, [])

  return (
    <TransactionModal transactions={transactions} onRespond={handleResponse} />
  )
}
