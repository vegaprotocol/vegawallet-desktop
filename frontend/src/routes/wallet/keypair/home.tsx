import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '../../../components/button'
import { ButtonUnstyled } from '../../../components/button-unstyled'
import { Header } from '../../../components/header'
import { EyeOff } from '../../../components/icons/eye-off'
import { PublicKey } from '../../../components/public-key'
import { Colors } from '../../../config/colors'
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function KeyPairHome() {
  const navigate = useNavigate()
  const { wallet, pubkey } = useParams<{ wallet: string; pubkey: string }>()
  const { dispatch } = useGlobal()
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <>
      <Header
        left={
          <ButtonUnstyled
            style={{ marginRight: 10, marginTop: 4, textDecoration: 'none' }}
            onClick={() => {
              navigate(`/wallet/${wallet})}`)
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
      <PublicKey keypair={keypair} />
      {keypair.isTainted && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            padding: 20,
            border: `1px solid ${Colors.INTENT_WARNING}`,
            margin: '12px 20px -12px'
          }}
        >
          <div>
            <EyeOff style={{ width: 24 }} />
          </div>
          <div>
            This key is marked as unsafe to use.{' '}
            <ButtonUnstyled
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
      <div style={{ padding: '48px 20px' }} data-testid='keypair-home'>
        <div style={{ display: 'flex', gap: 20, padding: '6px 0' }}>
          <div style={{ width: '50%' }}>
            <Button
              style={{ width: '100%' }}
              onClick={() =>
                dispatch({ type: 'SET_SIGN_MESSAGE_MODAL', open: true })
              }
            >
              Sign a message
            </Button>
          </div>
          <div style={{ width: '50%' }}>
            Verify your identity by providing a verifiable link from this key.
          </div>
        </div>
        {!keypair.isTainted && (
          <div style={{ display: 'flex', gap: 20, padding: '6px 0' }}>
            <div style={{ width: '50%' }}>
              <Button
                style={{ width: '100%' }}
                onClick={() =>
                  dispatch({ type: 'SET_TAINT_KEY_MODAL', open: true })
                }
              >
                Taint key
              </Button>
            </div>
            <div style={{ width: '50%' }}>
              Mark as unsafe to use to ensure this key will not be used to sign
              transactions.
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 20, padding: '6px 0' }}>
          <div style={{ width: '50%' }}>
            <Button
              style={{ width: '100%' }}
              onClick={() =>
                navigate(`/wallet/${wallet}/keypair/${pubkey}/transactions`)
              }
            >
              View transactions
            </Button>
          </div>
          <div style={{ width: '50%' }}>
            See transactions you have approved or rejected.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, padding: '6px 0' }}>
          <div style={{ width: '50%' }}>
            <Button
              style={{ width: '100%' }}
              onClick={() =>
                dispatch({ type: 'SET_UPDATE_KEY_MODAL', open: true })
              }
            >
              Update
            </Button>
          </div>
          <div style={{ width: '50%' }}>Update / change the key name.</div>
        </div>
      </div>
    </>
  )
}
