import { useCallback } from 'react'

import { useGlobal } from '../../../contexts/global/global-context'
import { formatDate } from '../../../lib/date'
import { parseTransaction } from '../../../lib/transactions'
import { Button } from '../../button'
import { ButtonGroup } from '../../button-group'
import { CodeBlock } from '../../code-block'
import { Dialog } from '../../dialog'
import { PublicKey } from '../../public-key'
import { Title } from '../../title'
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

  const onReponse = useCallback(
    async (decision: boolean) => {
      // @ts-ignore
      await service.RespondToInteraction({
        traceID: interaction.event.traceID,
        name: INTERACTION_RESPONSE_TYPE.DECISION,
        data: {
          approved: decision
        }
      })
    },
    [service, interaction]
  )

  return (
    <Dialog open={true} size='lg' title='Transaction request'>
      <div style={{ padding: '0 20px 20px' }}>
        <p>
          <pre>{transaction.hostname}</pre> has requesteda transaction "
          {transaction.title}" for <pre>{transaction.wallet}</pre>.
        </p>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <Title style={{ margin: '0 0 6px' }}>Wallet</Title>
        <p>{transaction.wallet}</p>
      </div>
      <PublicKey publicKey={transaction.publicKey} />
      <div style={{ padding: '20px 20px 0' }}>
        <Title style={{ margin: '0 0 12px' }}>Transaction details</Title>
        <CodeBlock style={{ fontSize: 12, marginBottom: 0 }}>
          <pre data-testid='transaction-payload'>
            {JSON.stringify(transaction.payload, null, 2)}
          </pre>
        </CodeBlock>
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        <Title style={{ margin: '0 0 6px' }}>Received</Title>
        <p>{formatDate(new Date(transaction.receivedAt))}</p>
      </div>
      <div style={{ padding: 20 }}>
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
