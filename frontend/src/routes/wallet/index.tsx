import { Navigate, Outlet, useParams } from 'react-router-dom'

export const Wallet = () => {
  const { wallet } = useParams()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <Outlet />
  )
}
