import { formatDate } from '../../lib/date'
import type { Transaction } from '../../lib/transactions'
import { truncateMiddle } from '../../lib/truncate-middle'
import { BreakText } from '../break-text'
import { CodeBlock } from '../code-block'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Title } from '../title'
import { TransactionStatus } from '../transaction-status'

type TransactionDetailsProps = {
  transaction: Transaction
}

const compileSectionList = (transaction: Transaction) => {
  const rows = [
    {
      value: <TransactionStatus transaction={transaction} />
    },
    {
      key: 'Wallet',
      value: <p>{transaction.wallet}</p>
    },
    {
      key: 'Public key',
      value: (
        <CopyWithTooltip text={transaction.publicKey}>
          <BreakText>{transaction.publicKey}</BreakText>
        </CopyWithTooltip>
      )
    }
  ]

  if (transaction.blockHeight) {
    rows.push({
      key: 'Block height',
      value: <>{transaction.blockHeight}</>
    })
  }

  if (transaction.signature) {
    rows.push({
      key: 'Signature',
      value: (
        <CopyWithTooltip text={transaction.signature}>
          {truncateMiddle(transaction.signature)}
        </CopyWithTooltip>
      )
    })
  }

  rows.push({
    key: 'Transaction details',
    value: (
      <CodeBlock style={{ fontSize: 12, marginBottom: 0 }}>
        <pre data-testid='transaction-payload'>
          {JSON.stringify(transaction.payload, null, 2)}
        </pre>
      </CodeBlock>
    )
  })

  rows.push({
    key: 'Received at',
    value: <p>{formatDate(new Date(transaction.receivedAt))}</p>
  })

  return rows
}

export const TransactionDetails = ({
  transaction
}: TransactionDetailsProps) => {
  const sectionList = compileSectionList(transaction)

  return (
    <div>
      {sectionList.map(({ key, value }, index) => (
        <div key={index} style={{ padding: '0 20px 20px' }}>
          {key && <Title style={{ margin: '0 0 12px' }}>{key}</Title>}
          {value}
        </div>
      ))}
    </div>
  )
}
