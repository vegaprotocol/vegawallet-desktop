import React from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { Key } from './wallet-container'

interface WalletKeyProps {
  keys: Key[]
}

export function WalletKey({ keys }: WalletKeyProps) {
  const { wallet, key } = useParams<{ wallet: string; key: string }>()

  const currKey = React.useMemo(() => {
    return keys.find(k => k.PublicKey === key)
  }, [keys, key])

  const back = <Link to={`/wallet/${wallet}`}>Back</Link>

  if (!currKey) {
    return (
      <>
        <BulletHeader tag='h1'>
          {wallet} / {back}
        </BulletHeader>
        <p>Key not found</p>
      </>
    )
  }

  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / {currKey.pubShort} / {back}
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
