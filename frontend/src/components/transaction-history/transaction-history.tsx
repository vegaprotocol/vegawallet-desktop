
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { Colors } from '../../config/colors'
import type { Transaction } from '../../lib/transactions'

const statusStyles = {
  display: 'inline-block',
  padding: '0.25rem 0.5rem',
  margin: '0.5rem 0.5rem 0.5rem 0',
  borderRadius: 2
}

const getTransactionInfo = (isApproved?: boolean) => {
  switch (isApproved) {
    case true: {
      return {
        color: Colors.INTENT_SUCCESS,
        text: 'Approved'
      }
    }
    case false: {
      return {
        color: Colors.INTENT_DANGER,
        text: 'Rejected'
      }
    }
    default: {
      return {
        color: Colors.GRAY_1,
        text: 'Unknown'
      }
    }
  }
}

const TransactionItem = ({
  transaction
}: {
  transaction: Transaction
}) => {
  const { color, text } = getTransactionInfo(transaction.decision)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <span style={{...statusStyles, background: color }}>
          {text}
        </span>
      </div>

    </div>
  )
}

export const TransactionHistory = () => {
  const { keypair } = useCurrentKeypair()

  console.log(keypair)

  return (
    <>
      {keypair?.transactions.length === 0 && (
        <div>No transactions in history.</div>
      )}

      {keypair && keypair?.transactions.length > 0 && keypair?.transactions.map((item, index) => (
        <TransactionItem key={index} transaction={item} />
      ))}
    </>
  )
}
