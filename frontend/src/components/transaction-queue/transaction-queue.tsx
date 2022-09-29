import { useCallback } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { useSubscription } from '../../hooks/use-subscription'
import { createEventSubscription, EVENTS } from '../../lib/events'
import { createLogger } from '../../lib/logging'
import { parseTx } from '../../lib/transactions'
import { TransactionItem } from '../transaction-item'

const logger = createLogger('TransactionQueue')

export const TransactionQueue = () => {
  const { service } = useGlobal()
  const { data, refetch, isLoading } = useSubscription({
    logger,
    getData: async () => {
      const { requests } = await service.ListConsentRequests()
      return requests
    },
    subscribe: createEventSubscription(EVENTS.NEW_CONSENT_REQUEST)
  })

  const handleResponse = useCallback(
    async (txId: string, decision: boolean) => {
      await service.ConsentToTransaction({
        txId,
        decision
      })
      refetch()
    },
    [service, refetch]
  )

  return (
    <>
      {!isLoading && data?.length === 0 && <div>No pending transactions.</div>}
      {!isLoading &&
        data?.map(item => (
          <TransactionItem
            key={item.tx}
            onRespond={handleResponse}
            transaction={parseTx(item)}
          />
        ))}
    </>
  )
}
