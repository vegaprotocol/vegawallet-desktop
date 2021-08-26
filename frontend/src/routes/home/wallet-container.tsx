import React from 'react'
import { Redirect, useRouteMatch } from 'react-router-dom'
import { IsAppInitialised, ListKeys, ListWallets } from '../../api/service'
import { truncateMiddle } from '../../lib/truncate-middle'
import { KeyPair } from '../../models/list-keys'

enum WalletStatus {
  Pending,
  Ready,
  None
}

interface Key extends KeyPair {
  alias: string
  pubShort: string
}

export type Wallets = {
  [walletName: string]: Key[]
}

interface WalletContainerProps {
  children: (data: {
    wallets: Wallets
    setWallets: React.Dispatch<React.SetStateAction<Wallets>>
  }) => JSX.Element
}

export const WalletContainer = ({ children }: WalletContainerProps) => {
  const match = useRouteMatch<{ wallet: string }>({ path: '/wallet/:wallet' })
  const [walletStatus, setWalletStatus] = React.useState(WalletStatus.Pending)
  const [wallets, setWallets] = React.useState<Wallets>({})

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised()

        if (!isInit) {
          setWalletStatus(WalletStatus.None)
          return
        }

        const wallets = await ListWallets()
        setWallets(Object.fromEntries(wallets.Wallets.map(w => [w, []])))
        setWalletStatus(WalletStatus.Ready)
      } catch (err) {
        setWalletStatus(WalletStatus.None)
      }
    }

    run()
  }, [])

  React.useEffect(() => {
    async function run() {
      if (walletStatus !== WalletStatus.Ready || !match?.params.wallet) {
        return
      }

      try {
        const res = await ListKeys({
          Name: match.params.wallet,
          // TODO: chat to Valentin about passphrase
          Passphrase: '123'
        })
        setWallets(curr => {
          if (!res.KeyPairs) {
            return {
              ...curr,
              [res.Name]: []
            }
          }

          return {
            ...curr,
            [res.Name]: res.KeyPairs.map(k => {
              const alias = k.Meta?.find(m => m.Key === 'alias')
              return {
                ...k,
                alias: alias?.Value || 'No alias',
                pubShort: truncateMiddle(k.PublicKey)
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [walletStatus, match?.params.wallet])

  if (walletStatus === WalletStatus.Pending) {
    return null
  }

  if (walletStatus === WalletStatus.None) {
    return <Redirect to='/import' />
  }

  return children({ wallets, setWallets })
}
