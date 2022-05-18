import { Colors } from '../../config/colors'
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
          const txObj = JSON.parse(tx.tx)
          const txData = parseTx(txObj)
          return (
            <div key={tx.txId}>
              <h2 style={{ margin: 0 }}>{txData.type}</h2>
              <table style={{ fontSize: 12, marginBottom: 10 }}>
                <tbody>
                  <tr>
                    <th
                      style={{
                        color: Colors.TEXT_COLOR_DEEMPHASISE
                      }}
                    >
                      Public key:
                    </th>
                    <td style={{ textAlign: 'right', wordBreak: 'break-all' }}>
                      {txObj.pubKey}
                    </td>
                  </tr>
                  <tr>
                    <th
                      style={{
                        color: Colors.TEXT_COLOR_DEEMPHASISE
                      }}
                    >
                      Signature:
                    </th>
                    <td style={{ textAlign: 'right', wordBreak: 'break-all' }}>
                      {tx.txId}
                    </td>
                  </tr>
                </tbody>
              </table>
              <CodeBlock style={{ fontSize: 12 }}>
                <pre>{JSON.stringify(txData.payload, null, 2)}</pre>
              </CodeBlock>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <Button onClick={() => onRespond(tx.txId, true)}>
                  Approve
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

const parseTx = (tx: unknown): { type: string; payload: object | null } => {
  if (tx !== null && tx !== undefined && typeof tx === 'object') {
    if ('orderSubmission' in tx) {
      // @ts-ignore
      return { type: 'Order submission', payload: tx.orderSubmission }
    }
    if ('withdrawSubmission' in tx) {
      // @ts-ignore
      return { type: 'Withdrawal submission', payload: tx.withdrawSubmission }
    }
    if ('voteSubmission' in tx) {
      // @ts-ignore
      return { type: 'Vote submission', payload: tx.voteSubmission }
    }
    if ('delegateSubmission' in tx) {
      // @ts-ignore
      return { type: 'Delegate submission', payload: tx.delegateSubmission }
    }
    if ('undelegateSubmission' in tx) {
      // @ts-ignore
      return { type: 'Undelegate submission', payload: tx.undelegateSubmission }
    }
  }

  return { type: 'Unknown transaction', payload: null }
}
