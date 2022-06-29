import React from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Header } from '../../components/header'
import { KeyValueTable } from '../../components/key-value-table'
import { useGlobal } from '../../contexts/global/global-context'
import { useAccounts } from '../../hooks/use-accounts'
import { addDecimal } from '../../lib/number'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Paths } from '../'

export function WalletKeyPair() {
  const navigate = useNavigate()
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair || !wallet) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'min-content 1fr min-content',
        height: '100%'
      }}
    >
      <div style={{ padding: 20 }}>
        <Header style={{ margin: 0 }}>
          {wallet.name} : {truncateMiddle(keypair.publicKey)} : {keypair.name}
        </Header>
      </div>
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
          <Button onClick={() => navigate('sign')}>Sign</Button>
        </ButtonGroup>
      </div>
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
          <div key={id}>
            <h3>{accounts[0].asset.symbol}</h3>
            <KeyValueTable
              rows={accounts.map(a => {
                return {
                  key: `${a.asset.symbol} ${a.type}`,
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
