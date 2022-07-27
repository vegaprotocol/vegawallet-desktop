import { Navigate, Outlet } from 'react-router-dom'

import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { Paths } from '../'

export function WalletKeyPair() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return <Outlet />
}
