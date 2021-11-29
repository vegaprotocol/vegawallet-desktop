import React from 'react'
import { ListWallets } from '../../api/service'
import { useGlobal } from '../../contexts/global/global-context'

interface WalletLoaderProps {
  children: React.ReactElement
}

export function WalletLoader({ children }: WalletLoaderProps) {
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    async function run() {
      try {
        const wallets = await ListWallets()

        dispatch({
          type: 'SET_WALLETS',
          wallets: wallets.Wallets
        })
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [dispatch])

  if (!state.wallets.length) {
    return <div>Loading...</div>
  }

  return children
}
