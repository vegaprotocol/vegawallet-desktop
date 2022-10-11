import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { ButtonUnstyled } from '../../../components/button-unstyled'
import { Header } from '../../../components/header'
import { TaintKeyDialog } from '../../../components/taint-key-dialog'
import { UpdateKeypairDialog } from '../../../components/update-keypair-dialog'
import { Colors } from '../../../config/colors'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'
import { Paths } from '../../'

export function WalletKeyPair() {
  const navigate = useNavigate()
  const { keypair, wallet } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <Header
        left={
          <ButtonUnstyled
            style={{ marginRight: 10, marginTop: 4, textDecoration: 'none' }}
            onClick={() => {
              navigate(`/wallet/${encodeURIComponent(wallet?.name ?? '')}`)
            }}
          >
            {'< Wallet'}
          </ButtonUnstyled>
        }
        center={
          keypair && (
            <>
              <div
                style={{
                  color: Colors.WHITE,
                  fontSize: 20
                }}
              >
                {keypair.name}
              </div>
              <div style={{ textTransform: 'initial' }}>
                {keypair.publicKeyShort}
              </div>
            </>
          )
        }
      />
      <Outlet />
      <TaintKeyDialog />
      <UpdateKeypairDialog />
    </>
  )
}
