import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Header } from '../../components/header'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentWallet } from '../../hooks/use-current-wallet'

export function WalletList() {
  const navigate = useNavigate()
  const { actions, dispatch } = useGlobal()
  const { wallet } = useCurrentWallet()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Header
        left={
          <ButtonUnstyled
            style={{ marginRight: 10, marginTop: 4, textDecoration: 'none' }}
            onClick={() => {
              dispatch(actions.deactivateWalletAction(wallet.name))
              navigate('/')
            }}
          >
            {'< Wallets'}
          </ButtonUnstyled>
        }
        center={
          <div
            style={{
              color: Colors.WHITE,
              fontSize: 20
            }}
          >
            {wallet.name}
          </div>
        }
      />
      <div style={{ padding: 20 }}>
        <Title>Keypairs</Title>
        <div
          style={{
            borderBottom: wallet.keypairs ? `1px solid ${Colors.BLACK}` : ''
          }}
        >
          {Object.keys(wallet.keypairs || {}).map(key => {
            if (!wallet.keypairs) {
              return null
            }
            const { name, publicKey, publicKeyShort } =
              wallet.keypairs[key] || {}
            return (
              <div
                key={publicKey}
                style={{
                  borderTop: `1px solid ${Colors.BLACK}`,
                  padding: '20px 0'
                }}
              >
                <div>
                  <ButtonUnstyled
                    onClick={() => {
                      navigate(
                        `/wallet/${encodeURIComponent(
                          wallet.name
                        )}/keypair/${publicKey}`
                      )
                    }}
                  >
                    {name}
                  </ButtonUnstyled>
                </div>
                <div style={{ color: Colors.GRAY_1 }}>
                  <CopyWithTooltip text={publicKey ?? ''}>
                    <span>{publicKeyShort}</span>
                  </CopyWithTooltip>
                </div>
              </div>
            )
          })}
        </div>
        <ButtonGroup orientation='vertical' style={{ padding: 20 }}>
          <Button
            data-testid='generate-keypair'
            onClick={() => {
              dispatch(actions.addKeypairAction(wallet.name))
            }}
          >
            Generate key pair
          </Button>
          <Button
            onClick={() =>
              dispatch({ type: 'SET_DELETE_WALLET_MODAL', open: true })
            }
            data-testid='delete-wallet'
          >
            Delete wallet
          </Button>
        </ButtonGroup>
      </div>
    </>
  )
}
