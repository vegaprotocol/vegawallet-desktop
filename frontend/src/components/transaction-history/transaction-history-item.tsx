import { backend as BackendModel } from '../../wailsjs/go/models'

type TransactionHistoryItemProps = {
  transaction: BackendModel.SentTransaction
}

export const TransactionHistoryItem = ({
  transaction
}: TransactionHistoryItemProps) => {
  return <div>{JSON.stringify(transaction)}</div>
}
