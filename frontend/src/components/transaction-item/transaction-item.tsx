import { formatDate } from '../../lib/date'
import { BreakText } from '../break-text'
import { Button } from '../button'
import { CodeBlock } from '../code-block'
import { KeyValueTable } from '../key-value-table'
import { ParsedTx, TransactionKeys } from '../../lib/transactions'

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

const headingStyles = {
  margin: '0 0 10px 0'
}

interface TransactionItemProps {
  transaction: ParsedTx
  onRespond: (id: string, decision: boolean) => void
}

export const TransactionItem = ({
  transaction,
  onRespond,
}: TransactionItemProps) => {
  if (transaction.pending) {
    return <div>Sending...</div>
  }

  if (transaction.error) {
    return (
      <>
        <h3 style={headingStyles} data-testid='transaction-title'>
          {TRANSACTION_TITLES[transaction.type]} failed
        </h3>
        <div>{transaction.error}</div>
      </>
    )
  }

  if (transaction.sentAt) {
    return (
      <>
        <h3 style={headingStyles} data-testid='transaction-title'>
          {TRANSACTION_TITLES[transaction.type]} sent
        </h3>
        <KeyValueTable
          style={{ marginBottom: 10 }}
          rows={[
            {
              key: 'Tx hash',
              value: <BreakText>{transaction.txHash}</BreakText>
            },
            {
              key: 'Sent at',
              value: formatDate(transaction.sentAt)
            }
          ]}
        />
      </>
    )
  }

  return (
    <>
      <h3 style={headingStyles} data-testid='transaction-title'>
        {TRANSACTION_TITLES[transaction.type]} received
      </h3>
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
    </>
  )
}
