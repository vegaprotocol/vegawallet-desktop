import { createLogger } from '../../lib/logging'
import { useGlobal } from '../../contexts/global/global-context'
import { useSubscription } from '../../hooks/use-subscription'
import { EVENTS, createEventSubscription } from '../../lib/events'
import { TransactionHistoryItem } from './transaction-history-item'

const logger = createLogger('TransactionHistory')

export const TransactionHistory = () => {
  const { service } = useGlobal()
  const { data, isLoading } = useSubscription({
    logger,
    getData: async () => {
      const { transactions } = await service.ListSentTransactions()
      return transactions
    },
    subscribe: createEventSubscription(EVENTS.TRANSACTION_SENT)
  })

  return (
    <>
      {!isLoading && data?.length === 0 && (
        <div>No transactions in history.</div>
      )}
      {!isLoading &&
        data?.map(item => (
          <TransactionHistoryItem key={item.tx} transaction={item} />
        ))}
    </>
  )
}
