import { useCallback, useEffect, useMemo, useState } from 'react'

import { Intent } from '../../config/intent'
import { events } from '../../lib/events'
import { createLogger } from '../../lib/logging'
import { Service } from '../../service'
import type { backend as BackendModel } from '../../wailsjs/go/models'
import { EventsOn } from '../../wailsjs/runtime'
import { AppToaster } from '../toaster'
import { TransactionModal } from '../transaction-modal'
import type { ParsedTx } from './transaction-types'
import { TransactionKeys } from './transaction-types'

const logger = createLogger('TransactionManager')

/**
 * Stores an array of parsed transactions which get passed to a modal
 */
export function TransactionManager() {
  const [transactions, setTransactions] = useState<ParsedTx[]>([])

  const handleResponse = useCallback(
    async (txId: string, decision: boolean) => {
      try {
        await Service.ConsentToTransaction({
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
    []
  )

  const handleDismiss = useCallback((txId: string) => {
    setTransactions(curr => {
      return curr.filter(t => t.txId !== txId)
    })
  }, [])

  // Get any already pending tx on startup
  useEffect(() => {
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
    EventsOn(events.NEW_CONSENT_REQUEST, (tx: BackendModel.ConsentRequest) => {
      setTransactions(curr => [...curr, parseTx(tx)])
    })

    window.runtime.EventsOn(
      events.TRANSACTION_SENT,
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

    run()
  }, [])

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
      onDismiss={handleDismiss}
    />
  )
}

/*
{
    "txId": "ji9cYZT7ydK1cixg2Rr7",
    "txHash": "84F6FEF6CC5C36037F757DFB5D7D277D333153CA35330ABFFD4C27BFF0953416",
    "tx": "{\"inputData\":\"CPOl8dmKyfmQKhCKgATKPkoKQDc3MzhhZTQyMmY4YTkwNWE2MThjYjViMTEzZTEyNjdmMWQyODg0MTczNjE3NDFlZDAzMzc2MmY4OWY2NDYzN2QYASABKAM4Ag==\",\"signature\":{\"value\":\"30759a2d7de1a9c4f027d0117717809ec12016b7ffc45f1c0c18db3f1a56673d2a4e6c990cf8f9d6dfb20c33caa36332fee5c1265fe2b0f6362462a7384d7f06\",\"algo\":\"vega/ed25519\",\"version\":1},\"pubKey\":\"704259efe7542917f4116956d296a20626084df02b9d6fbf9a742456f91de7eb\",\"version\":2,\"pow\":{\"tid\":\"B31FFC20E0A585C6D2B3C792F9B38CF976E27E78DF62C0D7BC9F7ADCCD6B81EE\",\"nonce\":\"48068\"}}",
    "sentAt": "2022-07-28T09:55:44.142764+01:00",
    "error": ""
}
*/

/**
 * Parses a raw consent request object into a more usable object where the transaction
 * payload has been turned from a json string into an object and we have determined
 * what kind of transaction it is
 */
const parseTx = (consentRequest: BackendModel.ConsentRequest): ParsedTx => {
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
    pubKey: '',
    pending: false,
    txHash: null,
    sentAt: null,
    error: null
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
