import { Navigate, useNavigate } from 'react-router-dom'

import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Header } from '../../components/header'
import { KeyValueTable } from '../../components/key-value-table'
import { useAccounts } from '../../hooks/use-accounts'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { addDecimal } from '../../lib/number'
import { Paths } from '../'

export function WalletKeyPair() {
  const navigate = useNavigate()
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <div style={{ padding: 20 }}>
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
      <div style={{ padding: 20 }}>
        <ButtonGroup>
          <Button onClick={() => navigate('sign')} data-testid='sign-page'>
            Sign
          </Button>
        </ButtonGroup>
      </div>
    </>
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
            <Header style={{ fontSize: 14, margin: 0 }}>
              {accounts[0].asset.symbol}
            </Header>
            <KeyValueTable
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
