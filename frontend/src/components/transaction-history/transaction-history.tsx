import { ButtonUnstyled } from '../button-unstyled'
import { ArrowTopRight } from '../icons/arrow-top-right'
import { Colors } from '../../config/colors'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { truncateMiddle } from '../../lib/truncate-middle'
import { formatDate } from '../../lib/date'
import { TransactionStatus, sortTransaction } from '../../lib/transactions'
import type { Transaction } from '../../lib/transactions'
import { TRANSACTION_TITLES } from '../interaction-manager/content/transaction'

const statusStyles = {
  display: 'inline-block',
  padding: '0.25rem 0.5rem',
  margin: '0.5rem 0.5rem 0.5rem 0',
  borderRadius: 2
}

const getTransactionInfo = (status?: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.SUCCESS: {
      return {
        color: Colors.INTENT_SUCCESS,
        text: 'Approved'
      }
    }
    case TransactionStatus.FAILURE: {
      return {
        color: Colors.INTENT_DANGER,
        text: 'Failed'
      }
    }
    case TransactionStatus.REJECTED: {
      return {
        color: Colors.INTENT_DANGER,
        text: 'Rejected'
      }
    }
    case TransactionStatus.PENDING: {
      return {
        color: Colors.GRAY_1,
        text: 'Pending'
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
  const { color, text } = getTransactionInfo(transaction.status)

  return (
    <div style={{ borderBottom: `1px solid ${Colors.BLACK}`, padding: '20px 0' }}>
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
          {TRANSACTION_TITLES[transaction.type]}
        </div>
        <div>
          {transaction.txHash
              ? (
                <ButtonUnstyled>
                  {truncateMiddle(transaction.txHash)}
                  <ArrowTopRight style={{ width: 13, marginLeft: 6 }} />
                </ButtonUnstyled>
              )
              : <span style={{ visibility: 'hidden' }}>No id</span>
          }
          <div style={{ textAlign: 'right', color: Colors.TEXT_COLOR_DEEMPHASISE, fontSize: 14 }}>{formatDate(transaction.receivedAt)}</div>
        </div>
      </div>
    </div>
  )
}

export const TransactionHistory = () => {
  const { keypair } = useCurrentKeypair()
  const transactionList = Object.values(keypair?.transactions || []).sort(sortTransaction)

  return (
    <>
      {transactionList.length === 0 && (
        <div>No transactions in history.</div>
      )}
      {transactionList.length > 0 && transactionList.map((item, index) => (
        <TransactionItem key={index} transaction={item} />
      ))}
    </>
  )
}
