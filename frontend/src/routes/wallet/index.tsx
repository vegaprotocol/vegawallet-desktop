import { useParams, Navigate, Outlet } from 'react-router-dom'
import { DeleteWalletDialog } from '../../components/delete-wallet-dialog'

import { Chrome } from '../../components/chrome'

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
