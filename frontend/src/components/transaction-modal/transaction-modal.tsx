import { Button } from '../button'
import { Dialog } from '../dialog'
import type { TransactionsState } from '../transaction-manager'

interface TransactionModalProps {
  transactions: TransactionsState
  onRespond: (txId: string, decision: boolean) => void
}

export function TransactionModal({
  transactions,
  onRespond
}: TransactionModalProps) {
  const isOpen = Boolean(transactions.length)

  return (
    <Dialog open={isOpen}>
      <div>
        {Object.entries(transactions).map(([txId, tx]) => {
          return (
            <div>
              <p>id: {txId}</p>
              <p>transaction: {tx.tx}</p>
              <p>received at: {tx.receivedAt}</p>
              <Button onClick={() => onRespond(txId, true)}>Confirm</Button>
              <Button onClick={() => onRespond(txId, false)}>Reject</Button>
            </div>
          )
        })}
      </div>
    </Dialog>
  )
}
