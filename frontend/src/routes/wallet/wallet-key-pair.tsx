import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { Header } from '../../components/header'
import { KeyValueTable } from '../../components/key-value-table'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'
import { Sign } from './sign'

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair || !wallet) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <div style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>
        Keypair name:{' '}
        <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
          {keypair.name}
        </span>
      </Header>
      <Header style={{ marginTop: 0, fontSize: 18 }}>Details</Header>
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
      <div style={{ marginTop: 20 }}>
        <Link to={Paths.Wallet}>
          <Button>Back</Button>
        </Link>
      </div>
      <Sign wallet={wallet.name} pubKey={keypair.publicKey} />
    </div>
  )
}
