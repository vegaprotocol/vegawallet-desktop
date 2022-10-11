import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useTaint } from '../../hooks/use-taint'
import { BreakText } from '../break-text'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Dialog } from '../dialog'
import { Title } from '../title'

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
    <Dialog open={state.taintKeyModalOpen}>
      <div data-testid='keypair-taint' style={{ padding: 20 }}>
        <Title style={{ marginTop: 0 }}>Taint key</Title>
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
        <div>Public key:</div>
        <div style={{ color: Colors.GRAY_1 }}>
          <CopyWithTooltip text={keypair.publicKey ?? ''}>
            <BreakText>{keypair.publicKey}</BreakText>
          </CopyWithTooltip>
        </div>
        <div style={{ display: 'flex', marginTop: 32, gap: 12 }}>
          <Button
            data-testid='taint-action'
            disabled={loading}
            onClick={() => {
              if (keypair.isTainted) {
                untaint()
              } else {
                taint()
              }
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
        </div>
      </div>
    </Dialog>
  )
}
