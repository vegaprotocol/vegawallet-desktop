import { formatDate } from '../../lib/date'
import { BreakText } from '../break-text'
import { Button } from '../button'
import { CodeBlock } from '../code-block'
import { Dialog } from '../dialog'
import type {
  ParsedTx,
  TransactionKeys
} from '../transaction-manager/transaction-types'
import { Colors } from "../../config/colors";

interface TransactionModalProps {
  transactions: ParsedTx[]
  onRespond: (txId: string, decision: boolean) => void
}

const TRANSACTION_TITLES: {
  [Key in TransactionKeys]: string
} = {
  unknown: 'Unknown transaction',
  orderSubmission: 'Order submission',
  orderCancellation: 'Order cancellation',
  orderAmendment: 'Order amendment',
  voteSubmission: 'Vote submission',
  withdrawSubmission: 'Withdraw submission',
  liquidityProvisionSubmission: 'Liquidity provision',
  liquidityProvisionCancellation: 'Liquidity provision cancellation',
  liquidityProvisionAmendment: 'Liquidity provision amendment',
  proposalSubmission: 'Proposal submission',
  announceNode: 'Announce node',
  nodeVote: 'Node vote',
  nodeSignature: 'Node signature',
  chainEvent: 'Chain event',
  oracleDataSubmission: 'Oracle data submission',
  undelegateSubmission: 'Undelegate submission',
  delegateSubmission: 'Delegate submission',
  transfer: 'Transfer',
  cancelTransfer: 'Cancel transfer',
  keyRotateSubmission: 'Key rotation submission',
  ethereumKeyRotateSubmission: 'Ethereum key rotation submission'
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
            <div
              key={transaction.txId}
              style={itemStyles}
              data-testid='transaction'
            >
              <h3 style={{ margin: 0 }} data-testid='transaction-title'>
                {TRANSACTION_TITLES[transaction.type]}
              </h3>
              <div style={{ color: Colors.WHITE, fontSize: 14 }}>Public key:</div>
              <div style={{ color: Colors.TEXT_COLOR_DEEMPHASISE, fontSize: 14 }}>
                <BreakText>{transaction.pubKey}</BreakText>
              </div>
              <div style={{ color: Colors.WHITE, fontSize: 14 }}>Signature:</div>
              <div style={{ color: Colors.TEXT_COLOR_DEEMPHASISE, fontSize: 14 }}>
                <BreakText>{transaction.txId}</BreakText>
              </div>
              <div style={{ color: Colors.WHITE, fontSize: 14 }}>Received at:</div>
              <div style={{ color: Colors.TEXT_COLOR_DEEMPHASISE, fontSize: 14 }}>
                <BreakText>{formatDate(transaction.receivedAt)}</BreakText>
              </div>
              <CodeBlock style={{ fontSize: 12 }}>
                <pre data-testid='transaction-payload'>
                  {JSON.stringify(transaction.tx, null, 2)}
                </pre>
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
