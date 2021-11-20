import React from 'react'
import { IsAppInitialised, ListKeys, ListWallets } from '../../api/service'
import { useGlobal } from '../../contexts/global/global-context'

interface AppLoaderProps {
  children: React.ReactElement
}

export function AppLoader({ children }: AppLoaderProps) {
  const [state, dispatch] = useGlobal()

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised()

        if (!isInit) {
          // setWalletStatus(WalletStatus.None)
          return
        }

        const wallets = await ListWallets()
        const keypairs = await ListKeys({
          Name: wallets.Wallets[0],
          Passphrase: '123'
        })

        dispatch({
          type: 'INIT_APP',
          wallets: wallets.Wallets,
          keypairs: keypairs.KeyPairs
        })
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [dispatch])

  if (!state.init) {
    return <div>Loading...</div>
  }

  return children
}
