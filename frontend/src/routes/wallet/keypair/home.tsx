import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../../components/button'
import { ButtonUnstyled } from '../../../components/button-unstyled'
import { Header } from '../../../components/header'
import { EyeOff } from '../../../components/icons/eye-off'
import { PublicKey } from '../../../components/public-key'
import { Title } from '../../../components/title'
import { Colors } from '../../../config/colors'
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function KeyPairHome() {
  const navigate = useNavigate()
  const { wallet, pubkey } = useParams<{ wallet: string; pubkey: string }>()
  const { dispatch } = useGlobal()
  const { wallet: currentWallet, keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <>
      <Header
        title={keypair.name}
        breadcrumb={currentWallet?.name}
        onBack={() => {
          navigate(`/wallet/${encodeURIComponent(wallet ?? '')}`)
        }}
      />
      <PublicKey keypair={keypair} />
      {keypair.isTainted && (
        <div
          data-testid='keypair-taint-notification'
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 20,
            border: `1px solid ${Colors.VEGA_PINK}`,
            margin: '20px 20px 12px'
          }}
        >
          <div>
            <EyeOff style={{ width: 24 }} />
          </div>
          <div>
            This key is marked as unsafe to use.{' '}
            <ButtonUnstyled
              data-testid='keypair-taint'
              onClick={() =>
                dispatch({ type: 'SET_TAINT_KEY_MODAL', open: true })
              }
            >
              Untaint
            </ButtonUnstyled>{' '}
            it to enable this key to be used to sign transactions.
          </div>
        </div>
      )}
      <div style={{ padding: '20px 20px 48px' }} data-testid='keypair-home'>
        <Title style={{ marginTop: 0 }}>Actions</Title>
        <div style={{ padding: '6px 0' }}>
          <div>
            <Button
              style={{ marginBottom: 8 }}
              data-testid='keypair-sign'
              onClick={() =>
                dispatch({ type: 'SET_SIGN_MESSAGE_MODAL', open: true })
              }
            >
              Sign a message
            </Button>
          </div>
          <p style={{ marginBottom: 20, color: Colors.TEXT_COLOR_DEEMPHASISE }}>
            Verify your identity by providing a verifiable link from this key.
          </p>
        </div>
        {!keypair.isTainted && (
          <div style={{ padding: '6px 0' }}>
            <div>
              <Button
                style={{ marginBottom: 8 }}
                data-testid='keypair-taint'
                onClick={() =>
                  dispatch({ type: 'SET_TAINT_KEY_MODAL', open: true })
                }
              >
                Taint key
              </Button>
            </div>
            <p
              style={{ marginBottom: 20, color: Colors.TEXT_COLOR_DEEMPHASISE }}
            >
              Mark as unsafe to use to ensure this key will not be used to sign
              transactions.
            </p>
          </div>
        )}
        <div style={{ padding: '6px 0' }}>
          <div>
            <Button
              style={{ marginBottom: 8 }}
              data-testid='keypair-transactions'
              onClick={() =>
                navigate(`/wallet/${wallet}/keypair/${pubkey}/transactions`)
              }
            >
              View transactions
            </Button>
          </div>
          <p style={{ marginBottom: 20, color: Colors.TEXT_COLOR_DEEMPHASISE }}>
            See transactions you have approved or rejected.
          </p>
        </div>
        <div style={{ padding: '6px 0' }}>
          <div>
            <Button
              style={{ marginBottom: 8 }}
              data-testid='keypair-update'
              onClick={() =>
                dispatch({ type: 'SET_UPDATE_KEY_MODAL', open: true })
              }
            >
              Update key
            </Button>
          </div>
          <p style={{ marginBottom: 20, color: Colors.TEXT_COLOR_DEEMPHASISE }}>
            Update / change the key name.
          </p>
        </div>
      </div>
    </>
  )
}
