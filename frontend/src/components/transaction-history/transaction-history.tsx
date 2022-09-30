import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { formatDate } from '../../lib/date'
import type { backend as BackendModel } from '../../wailsjs/go/models'

const statusStyles = {
  display: 'inline-block',
  padding: '0.25rem 0.5rem',
  margin: '0.5rem 0.5rem 0.5rem 0',
  borderRadius: 2
}

const TransactionStatus = ({ isSuccess }: { isSuccess: boolean }) => {
  if (isSuccess) {
    return (
      <span
        style={{
          ...statusStyles,
          backgroundColor: Colors.INTENT_SUCCESS
        }}
      >
        Confirmed
      </span>
    )
  }
  return (
    <span
      style={{
        ...statusStyles,
        backgroundColor: Colors.INTENT_DANGER
      }}
    >
      Failed
    </span>
  )
}

// @TODO: style and intergate when more data is available
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransactionItem = ({
  transaction
}: {
  transaction: BackendModel.SentTransaction
}) => {
  ;<div
    key={transaction.txId}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}
  >
    <div>
      <TransactionStatus isSuccess={!transaction.error} />
      <span>transaction id: {transaction.txId}</span>
    </div>
    <div>{formatDate(new Date(transaction.sentAt))}</div>
  </div>
}

export const TransactionHistory = () => {
  const { state } = useGlobal()

  return (
    <>
      {state.transactionHistory?.length === 0 && (
        <div>No transactions in history.</div>
      )}
      {state.transactionHistory?.length > 0 && (
        <div>{state.transactionHistory.length} transactions in history.</div>
      )}
    </>
  )
}
