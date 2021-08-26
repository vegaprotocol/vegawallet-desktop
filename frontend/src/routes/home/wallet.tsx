import './wallet.scss'
import React from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard'
import { Key } from './wallet-container'

interface WalletProps {
  keys: Key[]
}

export function Wallet({ keys }: WalletProps) {
  const { wallet } = useParams<{ wallet: string }>()

  return (
    <>
      <BulletHeader tag='h1'>
        {wallet} / <Link to='/'>Back</Link>
      </BulletHeader>
      {keys.length ? (
        <ul className='keypair-list'>
          {keys.map(k => (
            <KeyPairItem key={k.PublicKey} wallet={wallet} k={k} />
          ))}
        </ul>
      ) : (
        <p>No keys</p>
      )}
    </>
  )
}

interface KeyPairItemProps {
  wallet: string
  k: Key
}

export const KeyPairItem = ({ wallet, k }: KeyPairItemProps) => {
  const { push } = useHistory()
  const { copy, copied } = useCopyToClipboard()
  return (
    <li title={k.PublicKey}>
      <div className='keypair'>
        <div className='keypair__public-key'>
          {k.pubShort} {k.alias}
        </div>
        <div className='keypair__actions'>
          <button
            className='link'
            onClick={() => push(`/wallet/${wallet}/${k.PublicKey}`)}>
            Manage
          </button>
          <button className='link' onClick={() => alert('TODO: sign')}>
            Sign
          </button>
          <button className='link' onClick={() => copy(k.PublicKey)}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </li>
  )
}
