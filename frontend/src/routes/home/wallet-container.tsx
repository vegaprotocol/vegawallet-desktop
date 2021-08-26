import React from 'react'
import { useParams } from 'react-router-dom'
import { ListKeys } from '../../api/service'
import { truncateMiddle } from '../../lib/truncate-middle'
import { KeyPair } from '../../models/list-keys'
import { WalletAuth } from './wallet-auth'

export interface Key extends KeyPair {
  alias: string
  pubShort: string
}

interface WalletContainerProps {
  children: (data: { keys: Key[] }) => JSX.Element
}

export const WalletContainer = ({ children }: WalletContainerProps) => {
  const { wallet } = useParams<{ wallet: string }>()
  const [keys, setKeys] = React.useState<Key[] | null>(null)

  async function onSubmit({ passphrase }: { passphrase: string }) {
    try {
      const res = await ListKeys({
        Name: wallet,
        Passphrase: passphrase
      })
      setKeys(() => {
        if (!res.KeyPairs) {
          return []
        }

        return res.KeyPairs.map(k => {
          const alias = k.Meta?.find(m => m.Key === 'alias')
          return {
            ...k,
            alias: alias?.Value || 'No alias',
            pubShort: truncateMiddle(k.PublicKey)
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (keys === null) {
    return <WalletAuth name={wallet} onSubmit={onSubmit} />
  }

  return children({ keys })
}
