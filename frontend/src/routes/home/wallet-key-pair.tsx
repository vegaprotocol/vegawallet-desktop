import React from 'react'
import { Redirect, useParams } from 'react-router'
import { BreakText } from '../../components/break-text'
import { BulletHeader } from '../../components/bullet-header'
import { useGlobal } from '../../contexts/global/global-context'

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.PublicKey === pubkey)

  if (!keypair) {
    return <Redirect to='/' />
  }

  return (
    <>
      <BulletHeader tag='h1'>{keypair.Name}</BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{keypair.Name}</td>
          </tr>
          <tr>
            <th>Public key</th>
            <td>
              <BreakText>{keypair.PublicKey}</BreakText>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
