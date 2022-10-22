import { Navigate, Outlet, useParams } from 'react-router-dom'

import { RemoveWalletDialog } from '../../components/remove-wallet-dialog'

export const Wallet = () => {
  const { wallet } = useParams()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Outlet />
      <RemoveWalletDialog />
    </>
  )
}
