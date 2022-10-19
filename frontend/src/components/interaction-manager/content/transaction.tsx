import { useGlobal } from '../../../contexts/global/global-context'
import { formatDate } from '../../../lib/date'
import { parseTransaction } from '../../../lib/transactions'
import { Button } from '../../button'
import { ButtonGroup } from '../../button-group'
import { CodeBlock } from '../../code-block'
import { Dialog } from '../../dialog'
import { KeyValueTable } from '../../key-value-table'
import { PublicKey } from '../../public-key'
import type {
  InteractionContentProps,
  RequestTransactionSending
} from '../types'
import { INTERACTION_RESPONSE_TYPE } from '../types'

export const Transaction = ({
  interaction
}: InteractionContentProps<RequestTransactionSending>) => {
  const { service } = useGlobal()
  const transaction = parseTransaction(interaction.event.data)

  const onReponse = async (decision: boolean) => {
    // @ts-ignore
    await service.RespondToInteraction({
      traceID: interaction.event.traceID,
      name: INTERACTION_RESPONSE_TYPE.DECISION,
      data: {
        approved: decision
      }
    })
  }

  return (
    <Dialog open={true} title={`${transaction.title} received`}>
      <div style={{ padding: '0 20px 20px' }}>
        <PublicKey publicKey={transaction.publicKey} />
        <KeyValueTable
          style={{ marginBottom: 10 }}
          rows={[
            {
              key: 'Received at',
              value: formatDate(new Date(transaction.receivedAt))
            }
          ]}
        />
        <CodeBlock style={{ fontSize: 12, marginBottom: 16 }}>
          <pre data-testid='transaction-payload'>
            {JSON.stringify(transaction.payload, null, 2)}
          </pre>
        </CodeBlock>
        <ButtonGroup>
          <Button
            data-testid='wallet-transaction-request-approve'
            onClick={() => onReponse(true)}
          >
            Approve
          </Button>
          <Button
            data-testid='wallet-transaction-request-reject'
            onClick={() => onReponse(false)}
          >
            Reject
          </Button>
        </ButtonGroup>
      </div>
    </Dialog>
  )
}
