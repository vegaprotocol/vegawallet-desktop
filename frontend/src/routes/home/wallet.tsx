import './wallet.scss'
import React from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { ListKeys } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { ErrorMessage } from '../../components/error-message'
import { truncateMiddle } from '../../lib/truncate-middle'
import { KeyPair } from '../../models/list-keys'
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard'

interface Key extends KeyPair {
  alias: string
  pubShort: string
}

export function Wallet() {
  const { wallet } = useParams<{ wallet: string }>()
  const [keys, setKeys] = React.useState<Key[]>([])
  const [err, setErr] = React.useState<Error | null>(null)

  React.useEffect(() => {
    async function run() {
      try {
        const res = await ListKeys({ Name: wallet, Passphrase: '123' })
        setKeys(
          res.KeyPairs.map(k => {
            const alias = k.Meta?.find(m => m.Key === 'alias')
            return {
              ...k,
              alias: alias?.Value || 'No alias',
              pubShort: truncateMiddle(k.PublicKey)
            }
          })
        )
      } catch (err) {
        setErr(err)
      }
    }

    run()
  }, [wallet])

  if (err) {
    return <ErrorMessage message={err.message} />
  }

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
