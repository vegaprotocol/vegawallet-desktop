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
          <tr>
            {/* TODO: request password to reveal private key */}
            <th>Private key</th>
            <td>
              <BreakText>{keypair.PrivateKey}</BreakText>
            </td>
          </tr>
          <tr>
            <th>Tainted</th>
            <td>{keypair.IsTainted}</td>
          </tr>
          <tr>
            <th>Algorithm name</th>
            <td>{keypair.AlgorithmName}</td>
          </tr>
          <tr>
            <th>Algorithm version</th>
            <td>{keypair.AlgorithmVersion}</td>
          </tr>
          <tr>
            <th>Meta data</th>
            <td>{JSON.stringify(keypair.Meta)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
