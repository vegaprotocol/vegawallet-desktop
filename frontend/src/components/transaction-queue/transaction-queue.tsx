import { createLogger } from '../../lib/logging'
import { useGlobal } from '../../contexts/global/global-context'
import { useSubscription } from '../../hooks/use-subscription'
import { EVENTS, createEventSubscription } from '../../lib/events'
import { TransactionQueueItem } from './transaction-queue-item'

const logger = createLogger('TransactionQueue')

export const TransactionQueue = () => {
  const { service } = useGlobal()
  const { data, isLoading } = useSubscription({
    logger,
    getData: async () => {
      const { requests } = await service.ListConsentRequests()
      return requests
    },
    subscribe: createEventSubscription(EVENTS.NEW_CONSENT_REQUEST)
  })

  return (
    <>
      {!isLoading && data?.length === 0 && <div>No transactions queued.</div>}
      {!isLoading &&
        data?.map(item => (
          <TransactionQueueItem key={item.tx} transaction={item} />
        ))}
    </>
  )
}
