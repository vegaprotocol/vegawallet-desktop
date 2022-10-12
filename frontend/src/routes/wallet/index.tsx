import { Navigate, Outlet, useParams } from 'react-router-dom'

import { Chrome } from '../../components/chrome'
import { RemoveWalletDialog } from '../../components/remove-wallet-dialog'

export const Wallet = () => {
  const { wallet } = useParams()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <Chrome>
      <Outlet />
      <RemoveWalletDialog />
    </Chrome>
  )
}
