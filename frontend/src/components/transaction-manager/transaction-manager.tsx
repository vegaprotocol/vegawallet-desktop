import { useEffect, useMemo } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { EVENTS } from '../../lib/events'
import { parseTx } from '../../lib/transactions'
import type { backend as BackendModel } from '../../wailsjs/go/models'
import { EventsOff, EventsOn } from '../../wailsjs/runtime'
import { TransactionModal } from '../transaction-modal'

/**
 * Stores an array of parsed transactions which get passed to a modal
 */
export function TransactionManager() {
  const { service, state, actions, dispatch } = useGlobal()

  useEffect(() => {
    const load = async () => {
      const [queue, history] = await Promise.all([
        service.ListConsentRequests(),
        service.ListSentTransactions()
      ])
      dispatch({
        type: 'SET_TRANSACTION_QUEUE',
        payload: queue.requests.map(parseTx)
      })
      dispatch({
        type: 'SET_TRANSACTION_HISTORY',
        payload: history.transactions
      })
    }

    load()
  }, [service, dispatch])

  // Get any already pending tx on startup
  useEffect(() => {
    // Listen for new incoming transactions
    EventsOn(EVENTS.NEW_CONSENT_REQUEST, (tx: BackendModel.ConsentRequest) => {
      dispatch({
        type: 'SET_TRANSACTION_QUEUE',
        payload: [...state.transactionQueue, parseTx(tx)]
      })
    })

    EventsOn(
      EVENTS.TRANSACTION_SENT,
      async (incoming: BackendModel.SentTransaction) => {
        dispatch({
          type: 'SET_TRANSACTION_HISTORY',
          payload: [...state.transactionHistory, incoming]
        })
      }
    )

    return () => {
      EventsOff(
        EVENTS.NEW_CONSENT_REQUEST,
        EVENTS.TRANSACTION_SENT,
      )
    }
  }, [service, dispatch, state.transactionHistory, state.transactionQueue])

  const orderedTransactions = useMemo(() => {
    if (!state.transactionQueue.length) {
      return []
    }

    // Oldest at index 0
    return state.transactionQueue.sort((a, b) => {
      return a.receivedAt.getTime() - b.receivedAt.getTime()
    })
  }, [state.transactionQueue])

  return (
    <TransactionModal
      transactions={orderedTransactions}
      onRespond={(txId, decision) =>
        dispatch(actions.decideOnTransaction(txId, decision))
      }
    />
  )
}
