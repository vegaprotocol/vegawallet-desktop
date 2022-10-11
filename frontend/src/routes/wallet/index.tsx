import { Navigate, Outlet, useParams } from 'react-router-dom'

import { Chrome } from '../../components/chrome'
import { DeleteWalletDialog } from '../../components/delete-wallet-dialog'

export const Wallet = () => {
  const { wallet } = useParams()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <Chrome>
      <Outlet />
      <DeleteWalletDialog />
    </Chrome>
  )
}
