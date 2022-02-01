import React from 'react'
import { CreateWallet } from '../../api/service'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { CreateWalletResponse } from '../../models/wallet'
import { Header } from '../../components/header'
import { CodeBlock } from '../../components/code-block'
import { useGlobal } from '../../contexts/global/global-context'
import { addWalletAction } from '../../contexts/global/global-actions'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { FormGroup } from '../../components/form-group'
import { Intent } from '../../config/intent'
import { Button } from '../../components/button'
import { Callout } from '../../components/callout'
import { Warning } from '../../components/icons/warning'

interface FormFields {
  wallet: string
  passphrase: string
  confirmPassphrase: string
}

export const WalletCreator = ({ onComplete }: { onComplete: () => void }) => {
  const { response, submit } = useCreateWallet()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const passphrase = useWatch({ control, name: 'passphrase' })

  if (response) {
    return <WalletCreateSuccess response={response} onComplete={onComplete} />
  }

  return (
    <>
      <Header style={{ marginTop: 0 }}>Create wallet</Header>
      <form data-testid='create-wallet-form' onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='* Name'
          labelFor='wallet'
          intent={errors.wallet?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.wallet?.message}
        >
          <input
            data-testid='create-wallet-form-name'
            type='text'
            {...register('wallet', { required: 'Required' })}
            autoComplete='off'
          />
        </FormGroup>
        <FormGroup
          label='* Passphrase'
          labelFor='passphrase'
          intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.passphrase?.message}
        >
          <input
            data-testid='create-wallet-form-passphrase'
            type='password'
            {...register('passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='* Confirm passphrase'
          labelFor='confirmPassphrase'
          intent={
            errors.confirmPassphrase?.message ? Intent.DANGER : Intent.NONE
          }
          helperText={errors.confirmPassphrase?.message}
        >
          <input
            data-testid='create-wallet-form-passphrase-confirm'
            type='password'
            {...register('confirmPassphrase', {
              required: 'Required',
              pattern: {
                message: 'Password does not match',
                value: new RegExp(`^${passphrase}$`)
              }
            })}
          />
        </FormGroup>
        <div>
          <Button data-testid='create-wallet-form-submit' type='submit'>
            Submit
          </Button>
        </div>
      </form>
    </>
  )
}

interface WalletCreateSuccessProps {
  response: CreateWalletResponse
  onComplete: () => void
}

function WalletCreateSuccess({
  response,
  onComplete
}: WalletCreateSuccessProps) {
  return (
    <>
      <Header style={{ marginTop: 0 }}>Wallet created</Header>
      <Callout
        title='Warning'
        intent={Intent.DANGER}
        icon={<Warning style={{ width: 15, height: 15 }} />}
      >
        <p data-testid='wallet-warning'>
          Save your recovery phrase now, you will need it to recover your
          wallet. Keep it secure and secret. Your recovery phrase is only shown
          once and cannot be recovered.
        </p>
      </Callout>
      <p data-testid='wallet-version'>Wallet version</p>
      <p>
        <CodeBlock>{response.wallet.version}</CodeBlock>
      </p>
      <p>Recovery phrase</p>
      <p style={{ position: 'relative' }} data-testid='wallet-recovery-phrase'>
        <CodeBlock>{response.wallet.recoveryPhrase}</CodeBlock>
        <span style={{ position: 'absolute', top: 7, right: 10 }}>
          <CopyWithTooltip text={response.wallet.recoveryPhrase}>
            <ButtonUnstyled>
              <Copy style={{ width: 13, height: 13 }} />
            </ButtonUnstyled>
          </CopyWithTooltip>
        </span>
      </p>
      <Button onClick={onComplete} data-testid='view-wallet-button'>
        Complete
      </Button>
    </>
  )
}

function useCreateWallet() {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  )

  const submit = React.useCallback(
    async (values: FormFields) => {
      try {
        const resp = await CreateWallet({
          wallet: values.wallet,
          passphrase: values.passphrase
        })
        if (resp) {
          setResponse(resp)
          AppToaster.show({
            message: 'Wallet created!',
            intent: Intent.SUCCESS
          })
          dispatch(addWalletAction(values.wallet, resp.key))
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
        }
      } catch (err) {
        AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      }
    },
    [dispatch]
  )

  return {
    response,
    submit
  }
}
