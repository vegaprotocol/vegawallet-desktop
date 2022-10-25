import { Colors } from '../../config/colors'
import { formatDate } from '../../lib/date'
import type { Transaction } from '../../lib/transactions'

import { truncateMiddle } from '../../lib/truncate-middle'
import { ButtonUnstyled } from '../button-unstyled'
import { TransactionStatus } from '../transaction-status'
import { ArrowTopRight } from '../icons/arrow-top-right'
import { TRANSACTION_TITLES } from '../interaction-manager/content/transaction'

type TransactionItemProps = {
  transaction: Transaction,
  viewDetails: () => void
}

export const TransactionItem = ({ transaction, viewDetails }: TransactionItemProps) => {
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
          {transaction.txHash ? (
            <ButtonUnstyled>
              {truncateMiddle(transaction.txHash)}
              <ArrowTopRight style={{ width: 13, marginLeft: 6 }} />
            </ButtonUnstyled>
          ) : (
            <span style={{ visibility: 'hidden' }}>No id</span>
          )}
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
