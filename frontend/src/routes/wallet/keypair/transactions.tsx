import { Title } from '../../../components/title'
import { TransactionHistory } from '../../../components/transaction-history'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function Transactions() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <div style={{ padding: 20 }} data-testid='keypair-home'>
      <Title>History</Title>
      <TransactionHistory />
    </div>
  )
}
