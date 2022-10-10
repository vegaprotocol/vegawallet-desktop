import { useNavigate, Link, Navigate, Outlet } from 'react-router-dom'

import { ButtonUnstyled } from '../../components/button-unstyled'
import { DropdownItem, DropdownMenu } from '../../components/dropdown-menu'
import { Header } from '../../components/header'
import { Colors } from '../../config/colors'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

export function WalletKeyPair() {
  const navigate =  useNavigate()
  const { state, actions, dispatch } = useGlobal()
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return <Navigate to={Paths.Wallet} />
  }

  return (
    <>
      <Header
        left={(
          <ButtonUnstyled
            style={{ marginRight: 10, textDecoration: 'none' }}
            onClick={() => {
              if (state.wallet) {
                dispatch(actions.deactivateWalletAction(state.wallet.name))
              }
              navigate('/')
            }}
          >
            {'< Wallets'}
          </ButtonUnstyled>
        )}
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
    </>
  )
}
