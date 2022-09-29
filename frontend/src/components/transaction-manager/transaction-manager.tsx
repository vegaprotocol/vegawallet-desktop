import { useCallback, useEffect, useMemo, useState } from 'react'

import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { EVENTS } from '../../lib/events'
import { createLogger } from '../../lib/logging'
import type { ParsedTx } from '../../lib/transactions'
import { parseTx } from '../../lib/transactions'
import type { backend as BackendModel } from '../../wailsjs/go/models'
import { EventsOff, EventsOn } from '../../wailsjs/runtime'
import { AppToaster } from '../toaster'
import { TransactionModal } from '../transaction-modal'

const logger = createLogger('TransactionManager')

/**
 * Stores an array of parsed transactions which get passed to a modal
 */
export function TransactionManager() {
  const { service } = useGlobal()
  const [transactions, setTransactions] = useState<ParsedTx[]>([])

  const handleResponse = useCallback(
    async (txId: string, decision: boolean) => {
      try {
        await service.ConsentToTransaction({
          txId,
          decision
        })

        if (decision) {
          // Set to pending if approved
          setTransactions(curr => {
            return curr.map(t => {
              if (t.txId === txId) {
                return {
                  ...t,
                  pending: true
                }
              }
              return t
            })
          })
        } else {
          // If rejected remove it
          setTransactions(curr => {
            return curr.filter(t => t.txId !== txId)
          })
        }
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
    [service]
  )

  // Get any already pending tx on startup
  useEffect(() => {
    // Listen for new incoming transactions
    EventsOn(EVENTS.NEW_CONSENT_REQUEST, (tx: BackendModel.ConsentRequest) => {
      setTransactions(curr => [...curr, parseTx(tx)])
    })

    EventsOn(
      EVENTS.TRANSACTION_SENT,
      (incoming: BackendModel.SentTransaction) => {
        setTransactions(curr => {
          return curr.map(t => {
            if (t.txId === incoming.txId) {
              return {
                ...t,
                pending: false,
                txHash: incoming.txHash,
                error: incoming.error,
                sentAt: new Date(incoming.sentAt as string)
              }
            }
            return t
          })
        })
      }
    )

    return () => {
      EventsOff(EVENTS.NEW_CONSENT_REQUEST)
      EventsOff(EVENTS.TRANSACTION_SENT)
    }
  }, [service])

  const orderedTransactions = useMemo(() => {
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
