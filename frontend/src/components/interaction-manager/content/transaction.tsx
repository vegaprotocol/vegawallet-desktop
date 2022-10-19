import { Dialog } from '../../dialog'
import { Button } from '../../button'
import { ButtonGroup } from '../../button-group'
// import { TransactionItem } from '../../transaction-item'
import { useGlobal } from '../../../contexts/global/global-context'
import type {
  INTERACTION_RESPONSE_TYPE,
  InteractionContentProps,
  RequestTransactionSending,
} from '../types'

export const Transaction = ({ interaction }: InteractionContentProps<RequestTransactionSending>) => {
  const { service } = useGlobal()
  const transaction = JSON.parse(interaction.event.data.transaction)

  console.log(transaction)

  const onReponse = async (decision: boolean) => {
    await service.RespondToInteraction({
      traceID: interaction.event.traceID,
      name: INTERACTION_RESPONSE_TYPE.DECISION,
      data: {
        approved: decision,
      }
    })
  }

  return (
    <Dialog open={true}>
      transaction
      <ButtonGroup>
        <Button onClick={() => onReponse(true)}>Approve</Button>
        <Button onClick={() => onReponse(false)}>Reject</Button>
      </ButtonGroup>
    </Dialog>
  )
}
