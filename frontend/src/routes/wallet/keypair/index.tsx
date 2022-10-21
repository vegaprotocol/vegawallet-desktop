import { Navigate, Outlet } from 'react-router-dom'

import { SignMessageDialog } from '../../../components/sign-message-dialog'
import { TaintKeyDialog } from '../../../components/taint-key-dialog'
import { UpdateKeypairDialog } from '../../../components/update-keypair-dialog'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { Paths } from '../../'

export function WalletKeyPair() {
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <Outlet />
      <TaintKeyDialog />
      <UpdateKeypairDialog />
      <SignMessageDialog />
    </>
  )
}
