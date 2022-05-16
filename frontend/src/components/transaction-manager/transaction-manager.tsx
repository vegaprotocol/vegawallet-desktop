import * as Sentry from '@sentry/react'
import * as React from 'react'

import { NEW_PENDING_TRANSACTION } from '../../lib/events'
import { Service } from '../../service'
import type { PendingTransaction } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

// Generated types from wails contains convertValues which we don't want
export type Tx = Pick<
  PendingTransaction,
  'txId' | 'command' | 'pubKey' | 'receivedAt'
>

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<Tx[]>([])

  const handleResponse = React.useCallback(
    async (txId: string, decision: boolean) => {
      try {
        console.log(`Consent for tx: ${txId} ${decision}`)
        const res = await Service.ConsentPendingTransaction({
          txId,
          decision
        })
        console.log('ConsentPendingTransaction successful', res)

        // Consent successful remove it from state
        setTransactions(curr => {
          return curr.filter(tx => tx.txId !== txId)
        })
      } catch (err) {
        console.log('ConsentPendingTransaction failed')
        console.error(err)
      }
    },
    []
  )

  // Mount listener for incoming transactions
  React.useEffect(() => {
    window.runtime.EventsOn(NEW_PENDING_TRANSACTION, (tx: Tx) => {
      console.log('new_pending_transaction event', tx)
      setTransactions(curr => [...curr, tx])
    })
  }, [])

  // Get any already pending tx on startup
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await Service.GetPendingTransactions()
        console.log('GetPendingTransactions success', res)
        setTransactions(res.transactions)
      } catch (err) {
        Sentry.captureException(err)
        console.log('GetPendingTransactions failed')
        console.error(err)
      }
    }

    // TODO: Re-enable
    // run()
  }, [])

  return (
    <>
      <TransactionModal
        transactions={transactions}
        onRespond={handleResponse}
      />
      {/* TODO: Remove test emit tx */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'red',
          color: 'white'
        }}
        onClick={() => {
          window.runtime.EventsEmit(NEW_PENDING_TRANSACTION, {
            txId: Math.random().toString(),
            command: JSON.stringify({
              pubKey:
                'f8885edfa7ffdb6ed996ca912e9258998e47bf3515c885cf3c63fb56b15de36f',
              propagate: true,
              undelegateSubmission: {
                nodeId:
                  '12c81b738e8051152e1afe44376ec37bca9216466e6d44cdd772194bad0ada81',
                amount: '10000000',
                method: 'METHOD_NOW'
              }
            }),
            pubKey:
              'f8885edfa7ffdb6ed996ca912e9258998e47bf3515c885cf3c63fb56b15de36f',
            receivedAt: new Date().toISOString()
          })
        }}
      >
        Test Emit tx
      </div>
    </>
  )
}
