import { Navigate, Outlet } from 'react-router-dom'

import { Chrome } from '../../components/chrome'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'

export const Wallet = () => {
  const { wallet } = useCurrentKeypair()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <Chrome>
      <Outlet />
    </Chrome>
  )
}
