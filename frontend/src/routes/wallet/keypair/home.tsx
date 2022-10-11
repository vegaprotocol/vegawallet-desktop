import { Button } from '../../../components/button'
import { BreakText } from '../../../components/break-text'
import { CopyWithTooltip } from '../../../components/copy-with-tooltip'
import { Colors } from '../../../config/colors'
import { useGlobal } from '../../../contexts/global/global-context'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function KeyPairHome() {
  const { dispatch } = useGlobal()
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <div style={{ padding: 20 }} data-testid='keypair-home'>
      <div>Public key:</div>
      <div style={{ color: Colors.GRAY_1 }}>
        <CopyWithTooltip text={keypair.publicKey ?? ''}>
          <BreakText>{keypair.publicKey}</BreakText>
        </CopyWithTooltip>
      </div>
      <div style={{ display: 'grid', padding: '48px 0', gridTemplateColumns: '50% 50%', gap: 20 }}>
        <Button
          onClick={() => dispatch({ type: 'SET_SIGN_MESSAGE_MODAL', open: true })}
        >
          Sign a message
        </Button>
        <div>Verify your identity by providing a verifiable link from this key.</div>
        <Button
          onClick={() => dispatch({ type: 'SET_TAINT_KEY_MODAL', open: true })}
        >
          Taint key
        </Button>
        <div>Mark as unsafe to use to ensure this key will not be used to sign transactions.</div>
        <Button
          onClick={() => dispatch({ type: 'SET_TAINT_KEY_MODAL', open: true })}
        >
          View transactions
        </Button>
        <div>See transactions you have approved or rejected.</div>
        <Button
          onClick={() => dispatch({ type: 'SET_UPDATE_KEY_MODAL', open: true })}
        >
          Update
        </Button>
        <div>Update / change the key name.</div>
      </div>
    </div>
  )
}
