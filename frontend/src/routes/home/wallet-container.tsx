import React from 'react'
import { ListKeys } from '../../api/service'
import { truncateMiddle } from '../../lib/truncate-middle'
import { KeyPair } from '../../models/list-keys'

interface Key extends KeyPair {
  alias: string
  pubShort: string
}

interface WalletContainerProps {
  children: React.ReactNode
}

export const WalletContainer = ({ children }: WalletContainerProps) => {
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

  return <>{children}</>
}
