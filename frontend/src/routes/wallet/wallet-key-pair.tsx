import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { Paths } from '../'
import { WalletHeader } from './wallet-header'

export function WalletKeyPair() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <WalletHeader keypair={keypair} />
      <Outlet />
    </>
  )
}
