import { useForm } from 'react-hook-form'

import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useSign } from '../../hooks/use-sign'
import { BreakText } from '../break-text'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Dialog } from '../dialog'
import { FormGroup } from '../form-group'
import { Textarea } from '../forms/textarea'
import { Title } from '../title'

interface FormFields {
  message: string
}

export const SignMessageDialog = () => {
  const { state, dispatch } = useGlobal()
  const { keypair, wallet } = useCurrentKeypair()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const { sign, signedData, setSignedData } = useSign(
    keypair?.publicKey,
    wallet?.name
  )

  return (
    <Dialog open={state.signMessageModalOpen}>
      <div data-testid='keypair-sign'>
        <div style={{ padding: 20 }}>
          <Title
            style={{
              margin: 0,
              textTransform: 'none',
              color: Colors.WHITE,
              letterSpacing: 0,
              fontSize: 28
            }}
          >
            {signedData ? 'Signed message' : 'Sign message'}
          </Title>
        </div>
        <div style={{ padding: 20 }}>
          {signedData ? (
            <>
              <div
                style={{
                  color: Colors.WHITE,
                  marginBottom: 32
                }}
              >
                <CopyWithTooltip text={signedData}>
                  <BreakText>{signedData}</BreakText>
                </CopyWithTooltip>
              </div>
              <ButtonGroup inline>
                <Button
                  data-testid='sign-more'
                  onClick={() => setSignedData('')}
                >
                  <div>Sign another</div>
                </Button>
                <ButtonUnstyled
                  data-testid='sign-close'
                  onClick={() =>
                    dispatch({ type: 'SET_SIGN_MESSAGE_MODAL', open: false })
                  }
                >
                  Close
                </ButtonUnstyled>
              </ButtonGroup>
            </>
          ) : (
            <form onSubmit={handleSubmit(sign)}>
              <p style={{ marginBottom: 32 }}>
                Type a message and press sign to get a verifiable link to prove
                your identity from this key.
              </p>
              <FormGroup
                label='Message'
                labelFor='message'
                helperText={errors.message?.message}
              >
                <Textarea
                  data-testid='message-field'
                  {...register('message', { required: 'Required' })}
                />
              </FormGroup>
              <ButtonGroup inline>
                <Button data-testid='sign' type='submit'>
                  Sign
                </Button>
                <ButtonUnstyled
                  data-testid='sign-close'
                  onClick={() =>
                    dispatch({ type: 'SET_SIGN_MESSAGE_MODAL', open: false })
                  }
                >
                  Cancel
                </ButtonUnstyled>
              </ButtonGroup>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  )
}
