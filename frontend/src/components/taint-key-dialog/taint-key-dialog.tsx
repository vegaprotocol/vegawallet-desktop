import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useTaint } from '../../hooks/use-taint'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Dialog } from '../dialog'
import { PublicKey } from '../public-key'

export const TaintKeyDialog = () => {
  const { state, actions, dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const { loading, taint, untaint } = useTaint(
    dispatch,
    actions,
    keypair?.publicKey,
    wallet?.name
  )

  if (!keypair) {
    return null
  }

  return (
    <Dialog size='lg' open={state.isTaintKeyModalOpen} title='Taint key'>
      <div data-testid='keypair-taint' style={{ padding: '0 20px 20px' }}>
        {keypair.isTainted && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ marginBottom: 10 }}>
              This key has been marked as tainted.
            </p>
            <p>
              If you have tainted a key for security reasons, you should not
              untaint it.
            </p>
          </div>
        )}
        {!keypair.isTainted && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ marginBottom: 10 }}>
              Tainting a key pair marks it as unsafe to use and ensures it will
              not be used to sign transactions. This mechanism is useful when
              the key pair has been compromised.
            </p>
            <p>You can choose to untaint the key at any time.</p>
          </div>
        )}
      </div>
      <PublicKey publicKey={keypair.publicKey} />
      <div style={{ padding: '32px 20px 20px' }}>
        <ButtonGroup inline>
          <Button
            data-testid='taint-action'
            disabled={loading}
            onClick={() => {
              if (keypair.isTainted) {
                untaint()
              } else {
                taint()
              }
              dispatch({ type: 'SET_TAINT_KEY_MODAL', open: false })
            }}
          >
            {keypair.isTainted ? 'Untaint this key' : 'Taint this key'}
          </Button>
          <ButtonUnstyled
            onClick={() =>
              dispatch({ type: 'SET_TAINT_KEY_MODAL', open: false })
            }
          >
            Cancel
          </ButtonUnstyled>
        </ButtonGroup>
      </div>
    </Dialog>
  )
}
