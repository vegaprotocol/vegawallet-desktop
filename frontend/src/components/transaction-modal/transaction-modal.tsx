import type { Transaction } from '../../lib/transactions'
import { Dialog } from '../dialog'
import { TransactionItem } from '../transaction-item'

interface TransactionModalProps {
  transactions: Transaction[]
  onRespond: (txId: string, decision: boolean) => void
}

const getTitle = (size: number) =>
  `${size} pending transaction${size !== 1 ? 's' : ''}`

export function TransactionModal({
  transactions,
  onRespond
}: TransactionModalProps) {
  return (
    <Dialog
      open={Boolean(transactions.length)}
      size='lg'
      title={getTitle(transactions.length)}
    >
      <div data-testid='transaction-dialog'>
        {transactions.map((transaction, i) => {
          const itemStyles =
            i < transactions.length - 1
              ? {
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom: '1px solid white'
                }
              : undefined

          return (
            <div
              key={transaction.txId}
              style={itemStyles}
              data-testid='transaction'
            >
              <TransactionItem
                transaction={transaction}
                onRespond={onRespond}
              />
            </div>
          )
        })}
      </div>
    </Dialog>
  )
}
