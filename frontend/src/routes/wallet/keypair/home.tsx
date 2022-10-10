import { BreakText } from '../../../components/break-text'
import { Title } from '../../../components/title'
import { KeyValueTable } from '../../../components/key-value-table'
import { CopyWithTooltip } from '../../../components/copy-with-tooltip'
import { TransactionHistory } from '../../../components/transaction-history'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function KeyPairHome() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <div style={{ padding: 20 }} data-testid='keypair-home'>
      <Title style={{ marginTop: 0 }}>Details</Title>
      <KeyValueTable
        rows={[
          { key: 'Name', value: keypair.name, dataTestId: 'keypair-name' },
          {
            key: 'Public key',
            value: (
              <CopyWithTooltip text={keypair.publicKey ?? ''}>
                <BreakText>{keypair.publicKey}</BreakText>
              </CopyWithTooltip>
            ),
            dataTestId: 'public-key'
          }
        ]}
      />
      <Title>History</Title>
      <TransactionHistory />
    </div>
  )
}
