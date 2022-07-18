import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { Paths } from '../'
import { WalletHeader } from './header'

export function WalletKeyPair() {
  const { wallet, keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <WalletHeader wallet={wallet} keypair={keypair} />
      <Outlet />
    </>
  )
}
