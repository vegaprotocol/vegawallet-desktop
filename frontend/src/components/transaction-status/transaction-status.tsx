import { Colors } from '../../config/colors'
import type { Transaction } from '../../lib/transactions'
import { TransactionStatus as TransactionStatusTypes } from '../../lib/transactions'

const statusStyles = {
  display: 'inline-block',
  color: Colors.WHITE,
  padding: '0.25rem 0.5rem',
  margin: '0.5rem 0.5rem 0.5rem 0',
  borderRadius: 2
}

const getTransactionInfo = (status?: TransactionStatusTypes) => {
  switch (status) {
    case TransactionStatusTypes.SUCCESS: {
      return {
        background: Colors.INTENT_SUCCESS,
        text: 'Approved'
      }
    }
    case TransactionStatusTypes.FAILURE: {
      return {
        background: Colors.INTENT_DANGER,
        text: 'Failed'
      }
    }
    case TransactionStatusTypes.REJECTED: {
      return {
        background: Colors.INTENT_DANGER,
        text: 'Rejected'
      }
    }
    case TransactionStatusTypes.PENDING: {
      return {
        background: Colors.GRAY_1,
        text: 'Pending'
      }
    }
    default: {
      return {
        background: Colors.GRAY_1,
        text: 'Unknown'
      }
    }
  }
}

type TransactionStatusProps = {
  transaction: Transaction
}

export const TransactionStatus = ({ transaction }: TransactionStatusProps) => {
  const { background, text } = getTransactionInfo(transaction.status)

  return <span style={{ ...statusStyles, background }}>{text}</span>
}
