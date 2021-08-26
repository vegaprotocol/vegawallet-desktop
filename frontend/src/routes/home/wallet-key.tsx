import React from 'react'
import { useParams } from 'react-router'
import { BulletHeader } from '../../components/bullet-header'
import { Wallets } from './wallet-container'

interface WalletKeyProps {
  wallets: Wallets
}

export const WalletKey = ({ wallets }: WalletKeyProps) => {
  const { wallet, key } = useParams<{ wallet: string; key: string }>()

  const currKey = React.useMemo(() => {
    return wallets[wallet].find(k => k.PublicKey === key)
  }, [wallets, wallet, key])

  if (!currKey) return <p>No key</p>

  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / {currKey.pubShort}
      </BulletHeader>
      <table>
        <tbody>
          <tr>
            <th>Alias</th>
            <td>{currKey.alias}</td>
          </tr>
          <tr>
            <th>Public key</th>
            <td>{currKey.pubShort}</td>
          </tr>
          <tr>
            <th>Tainted</th>
            <td>{currKey.IsTainted.toString()}</td>
          </tr>
          <tr>
            <th>Algorithm</th>
            <td>
              {currKey.AlgorithmName} v{currKey.AlgorithmVersion}
            </td>
          </tr>
          <tr>
            <th>Metadata</th>
            <td>
              {currKey.Meta
                ? currKey.Meta.map(m => (
                    <span key={m.Key} style={{ marginLeft: 3 }}>
                      {m.Key}:{m.Value}
                    </span>
                  ))
                : 'None'}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
