import { formatDate } from '../../lib/date'
import { BreakText } from '../break-text'
import { Button } from '../button'
import { CodeBlock } from '../code-block'
import { Dialog } from '../dialog'
import { KeyValueTable } from '../key-value-table'
import type { ParsedTx } from '../transaction-manager'

interface TransactionModalProps {
  transactions: ParsedTx[]
  onRespond: (txId: string, decision: boolean) => void
}

export function TransactionModal({
  transactions,
  onRespond
}: TransactionModalProps) {
  return (
    <Dialog open={Boolean(transactions.length)}>
      <div data-testid='transaction-dialog'>
        {transactions.length > 1 && (
          <h2 style={{ marginTop: 0, fontSize: 18 }}>
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
            <div key={transaction.txId} style={itemStyles}>
              <h2 style={{ margin: 0 }}>{transaction.type}</h2>
              <KeyValueTable
                style={{ marginBottom: 10 }}
                rows={[
                  {
                    key: 'Public key',
                    value: <BreakText>{transaction.pubKey}</BreakText>
                  },
                  {
                    key: 'Signature',
                    value: <BreakText>{transaction.txId}</BreakText>
                  },
                  {
                    key: 'Received at',
                    value: formatDate(transaction.receivedAt)
                  }
                ]}
              />
              <CodeBlock style={{ fontSize: 12 }}>
                <pre>{JSON.stringify(transaction.tx, null, 2)}</pre>
              </CodeBlock>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <Button
                  onClick={() => onRespond(transaction.txId, true)}
                  data-testid='approve-transaction'
                >
                  Approve
                </Button>
                <Button
                  onClick={() => onRespond(transaction.txId, false)}
                  data-testid='reject-transaction'
                >
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
