import React from 'react'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { BreakText } from '../../components/break-text'
import { Button } from '../../components/button'
import { Header } from '../../components/header'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair) {
    return <Redirect to={Paths.Wallet} />
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
            <td>{keypair.name}</td>
          </tr>
          <tr>
            <th>Public key</th>
            <td>
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
