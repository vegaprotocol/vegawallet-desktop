import { backend as BackendModel } from '../../wailsjs/go/models'

type TransactionQueueItemProps = {
  transaction: BackendModel.ConsentRequest
}

export const TransactionQueueItem = ({
  transaction
}: TransactionQueueItemProps) => {
  return <div>{JSON.stringify(transaction)}</div>
}
