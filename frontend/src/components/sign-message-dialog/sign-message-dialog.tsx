import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useSign } from '../../hooks/use-sign'
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
  const { state } = useGlobal()
  const navigate = useNavigate()
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
          <Title style={{ margin: 0 }}>Sign</Title>
        </div>
        <div style={{ padding: 20 }}>
          {signedData ? (
            <>
              <h4>Signed message:</h4>
              <CopyWithTooltip text={signedData}>
                <ButtonUnstyled
                  style={{
                    textAlign: 'left',
                    wordBreak: 'break-all',
                    color: Colors.TEXT_COLOR_DEEMPHASISE
                  }}
                >
                  {signedData}
                </ButtonUnstyled>
              </CopyWithTooltip>
              <Button
                data-testid='sign-more'
                style={{ marginTop: 12 }}
                onClick={() => setSignedData('')}
              >
                Sign more
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit(sign)}>
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
              <ButtonGroup>
                <Button onClick={() => navigate(-1)}>Cancel</Button>
                <Button data-testid='sign' type='submit'>
                  Sign
                </Button>
              </ButtonGroup>
            </form>
          )}
        </div>
      </div>
    </Dialog>
  )
}
