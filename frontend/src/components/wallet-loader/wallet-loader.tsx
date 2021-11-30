import React from 'react'
import { Link } from 'react-router-dom'
import { ListWallets } from '../../api/service'
import { useGlobal } from '../../contexts/global/global-context'
import { BulletHeader } from '../bullet-header'

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
    return (
      <>
        <BulletHeader tag='h1'>Wallets</BulletHeader>
        <p>
          No wallets. <Link to='/import'>Import or create one</Link>
        </p>
      </>
    )
  }

  return children
}
