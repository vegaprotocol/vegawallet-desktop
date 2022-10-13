import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Header } from '../../components/header'
import { EyeOff } from '../../components/icons/eye-off'
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
        title={wallet.name}
        breadcrumb='Wallets'
        onBack={() => {
          dispatch(actions.deactivateWalletAction(wallet.name))
          navigate('/')
        }}
      />
      <div style={{ padding: 20, paddingTop: 0 }}>
        <Title element='h2' style={{ marginTop: 0 }}>
          Keypairs
        </Title>
        <div
          style={{
            borderBottom: wallet.keypairs ? `1px solid ${Colors.BLACK}` : ''
          }}
        >
          {Object.keys(wallet.keypairs || {}).map(key => {
            if (!wallet.keypairs) {
              return null
            }
            const { name, publicKey, publicKeyShort, isTainted } =
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
                    data-testid={`wallet-keypair-${publicKey}`}
                    onClick={() => {
                      navigate(
                        `/wallet/${encodeURIComponent(
                          wallet.name
                        )}/keypair/${publicKey}`
                      )
                    }}
                  >
                    {isTainted && (
                      <EyeOff style={{ width: 13, marginRight: 6 }} />
                    )}
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
        <ButtonGroup orientation='vertical' style={{ padding: '20px 0' }}>
          <Button
            data-testid='generate-keypair'
            onClick={() => {
              dispatch(actions.addKeypairAction(wallet.name))
            }}
          >
            Generate key pair
          </Button>
          <ButtonUnstyled
            onClick={() =>
              dispatch({ type: 'SET_REMOVE_WALLET_MODAL', open: true })
            }
            data-testid='delete-wallet'
          >
            Remove wallet
          </ButtonUnstyled>
        </ButtonGroup>
      </div>
    </>
  )
}
