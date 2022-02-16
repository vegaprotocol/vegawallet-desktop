import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { Header } from '../../components/header'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair) {
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
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td data-testid='keypair-name'>{keypair.name}</td>
          </tr>
          <tr>
            <th>Public key</th>
            <td data-testid='public-key'>
              <BreakText>{keypair.publicKey}</BreakText>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <Link to={Paths.Wallet}>
          <Button>Back</Button>
        </Link>
      </div>
    </div>
  )
}
