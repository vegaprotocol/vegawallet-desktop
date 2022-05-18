import * as Sentry from '@sentry/react'
import * as React from 'react'

import { NEW_CONSENT_REQUEST } from '../../lib/events'
import { Service } from '../../service'
import type { ConsentRequest } from '../../wailsjs/go/models'
import { TransactionModal } from '../transaction-modal'

export type TransactionsState = {
  [id: string]: ConsentRequest
}

export function TransactionManager() {
  const [transactions, setTransactions] = React.useState<Tx[]>([])

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
    window.runtime.EventsOn(NEW_CONSENT_REQUEST, (txId: string) => {
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
