import { Colors } from '../../config/colors'
import { useExplorerUrl } from '../../hooks/use-explorer-url'
import { formatDate } from '../../lib/date'
import type { Transaction } from '../../lib/transactions'
import { truncateMiddle } from '../../lib/truncate-middle'
import { ButtonUnstyled } from '../button-unstyled'
import { ArrowTopRight } from '../icons/arrow-top-right'
import { TRANSACTION_TITLES } from '../interaction-manager/content/transaction'
import { TransactionStatus } from '../transaction-status'

type TransactionItemProps = {
  transaction: Transaction
  viewDetails: () => void
}

const TransactionId = ({
  transaction
}: Pick<TransactionItemProps, 'transaction'>) => {
  const explorerUrl = useExplorerUrl()

  if (!transaction.txHash) {
    return <span style={{ visibility: 'hidden' }}>No id</span>
  }

  if (explorerUrl) {
    return (
      <a
        href={`${explorerUrl}/txs/${transaction.txHash}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        {truncateMiddle(transaction.txHash)}
        <ArrowTopRight style={{ width: 13, marginLeft: 6 }} />
      </a>
    )
  }

  return <span>{truncateMiddle(transaction.txHash)}</span>
}

export const TransactionItem = ({
  transaction,
  viewDetails
}: TransactionItemProps) => {
  return (
    <div
      style={{ borderBottom: `1px solid ${Colors.BLACK}`, padding: '20px 0' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ButtonUnstyled onClick={viewDetails}>
          <TransactionStatus transaction={transaction} />
          {TRANSACTION_TITLES[transaction.type]}
        </ButtonUnstyled>
        <div>
          <TransactionId transaction={transaction} />
          <div
            style={{
              textAlign: 'right',
              color: Colors.TEXT_COLOR_DEEMPHASISE,
              fontSize: 14
            }}
          >
            {formatDate(transaction.receivedAt)}
          </div>
        </div>
      </div>
    </div>
  )
}
