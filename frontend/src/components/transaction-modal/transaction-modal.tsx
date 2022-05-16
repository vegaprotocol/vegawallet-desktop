import { formatDate } from '../../lib/date'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Button } from '../button'
import { CodeBlock } from '../code-block'
import { Dialog } from '../dialog'
import type { Tx } from '../transaction-manager'

interface TransactionModalProps {
  transactions: Tx[]
  onRespond: (txId: string, decision: boolean) => void
}

export function TransactionModal({
  transactions,
  onRespond
}: TransactionModalProps) {
  const isOpen = transactions.length > 0

  return (
    <Dialog open={isOpen}>
      <div>
        {transactions.map(tx => {
          return (
            <div key={tx.txId}>
              <p>id: {tx.txId}</p>
              <p>pubkey: {truncateMiddle(tx.pubKey)}</p>
              <p>
                received at: {formatDate(new Date(tx.receivedAt as string))}
              </p>
              <CodeBlock style={{ fontSize: 12 }}>
                <pre>{JSON.stringify(JSON.parse(tx.command), null, 2)}</pre>
              </CodeBlock>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <Button onClick={() => onRespond(tx.txId, true)}>
                  Confirm
                </Button>
                <Button onClick={() => onRespond(tx.txId, false)}>
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Dialog>
  )
}
