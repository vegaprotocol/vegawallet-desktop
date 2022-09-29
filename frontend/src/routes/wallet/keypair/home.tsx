import { BreakText } from '../../../components/break-text'
import { Header } from '../../../components/header'
import { KeyValueTable } from '../../../components/key-value-table'
import { TransactionHistory } from '../../../components/transaction-history'
import { TransactionQueue } from '../../../components/transaction-queue'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function KeyPairHome() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <div style={{ padding: 20 }} data-testid='keypair-home'>
      <Header style={{ marginTop: 0 }}>Details</Header>
      <KeyValueTable
        rows={[
          { key: 'Name', value: keypair.name, dataTestId: 'keypair-name' },
          {
            key: 'Public key',
            value: <BreakText>{keypair.publicKey}</BreakText>,
            dataTestId: 'public-key'
          }
        ]}
      />
      <Header>Queued transactions</Header>
      <TransactionQueue />
      <Header>History</Header>
      <TransactionHistory />
    </div>
  )
}
