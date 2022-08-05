import { BreakText } from '../../../components/break-text'
import { Header } from '../../../components/header'
import { KeyValueTable } from '../../../components/key-value-table'
import { useAccounts } from '../../../hooks/use-accounts'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { addDecimal } from '../../../lib/number'

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
      <Header>Assets</Header>
      <AccountsTable publicKey={keypair.publicKey} />
    </div>
  )
}

interface AccountsTableProps {
  publicKey: string
}

function AccountsTable({ publicKey }: AccountsTableProps) {
  const { accounts, loading, error } = useAccounts(publicKey)

  if (error) {
    return <p>Could not retrieve account information</p>
  }

  if (loading) {
    return <p>Loading accounts</p>
  }

  const entries = Object.entries(accounts)

  if (!entries.length) {
    return <p>No accounts</p>
  }

  return (
    <>
      {entries.map(([id, accounts]) => {
        return (
          <div key={id} style={{ marginBottom: 20 }}>
            <Header
              data-testid='asset-name'
              style={{ fontSize: 14, margin: 0 }}
            >
              {accounts[0].asset.name}
            </Header>
            <KeyValueTable
              data-testid='assets-table'
              rows={accounts.map(a => {
                return {
                  key: a.type,
                  value: addDecimal(a.balance, a.asset.decimals)
                }
              })}
            />
          </div>
        )
      })}
    </>
  )
}
