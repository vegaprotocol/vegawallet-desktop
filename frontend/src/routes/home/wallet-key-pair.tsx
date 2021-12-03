import React from 'react'
import { Redirect, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { BreakText } from '../../components/break-text'
import { BulletHeader } from '../../components/bullet-header'
import { useGlobal } from '../../contexts/global/global-context'

export function WalletKeyPair() {
  const {
    state: { wallet }
  } = useGlobal()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)

  if (!keypair) {
    return <Redirect to='/' />
  }

  return (
    <>
      <div>
        <Link to='/wallet'>Back</Link>
      </div>
      <BulletHeader tag='h1'>{keypair.name}</BulletHeader>
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
    </>
  )
}
