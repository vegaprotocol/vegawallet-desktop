import { Dialog } from '../dialog'
import type { ParsedTx } from '../../lib/transactions'
import { TransactionItem } from '../transaction-item'

interface TransactionModalProps {
  transactions: ParsedTx[]
  onRespond: (txId: string, decision: boolean) => void
}

export function TransactionModal({
  transactions,
  onRespond,
}: TransactionModalProps) {
  return (
    <Dialog open={Boolean(transactions.length)} size='lg'>
      <div data-testid='transaction-dialog'>
        {transactions.length > 1 && (
          <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 20 }}>
            {transactions.length} pending transactions
          </h2>
        )}
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
