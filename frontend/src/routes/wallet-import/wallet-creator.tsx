import React from 'react'
import { CreateWallet } from '../../api/service'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { CreateWalletResponse } from '../../models/create-wallet'
import { Link } from 'react-router-dom'
import { Header } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'
import { useGlobal } from '../../contexts/global/global-context'
import { addWalletAction } from '../../contexts/global/global-actions'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { WalletPaths } from '../wallet'
import { FormGroup } from '../../components/form-group'
import { Intent } from '../../config/intent'
import { Button } from '../../components/button'
import { Callout } from '../../components/callout'
import { Warning } from '../../components/icons/warning'
import { Paths } from '../router-config'
import { useNetwork } from '../../contexts/network/network-context'

interface FormFields {
  name: string
  passphrase: string
  confirmPassphrase: string
}

export const WalletCreator = () => {
  const { response, submit } = useCreateWallet()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const passphrase = useWatch({ control, name: 'passphrase' })

  if (response) {
    return <WalletCreateSuccess response={response} />
  }

  return (
    <>
      <Header>Create wallet</Header>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='* Name'
          labelFor='name'
          intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.name?.message}>
          <input
            type='text'
            {...register('name', { required: 'Required' })}
            autoComplete='off'
          />
        </FormGroup>
        <FormGroup
          label='* Passphrase'
          labelFor='passphrase'
          intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.passphrase?.message}>
          <input
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
          helperText={errors.confirmPassphrase?.message}>
          <input
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
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </>
  )
}

interface WalletCreateSuccessProps {
  response: CreateWalletResponse
}

function WalletCreateSuccess({ response }: WalletCreateSuccessProps) {
  const {
    state: { network }
  } = useNetwork()
  return (
    <>
      <Header>Wallet created</Header>
      <Callout
        title='Warning'
        intent={Intent.DANGER}
        icon={<Warning style={{ width: 15, height: 15 }} />}>
        <p>
          Save your recovery phrase now, you will need it to recover your
          wallet. Keep it secure and secret. Your recovery phrase is only shown
          once and cannot be recovered.
        </p>
      </Callout>
      <p>Wallet version</p>
      <p>
        <CodeBlock>{2}</CodeBlock>
      </p>
      <p>Recovery phrase</p>
      <p style={{ position: 'relative' }}>
        <CodeBlock>{response.RecoveryPhrase}</CodeBlock>
        <span style={{ position: 'absolute', top: 7, right: 10 }}>
          <CopyWithTooltip text={response.RecoveryPhrase}>
            <ButtonUnstyled>
              <Copy style={{ width: 13, height: 13 }} />
            </ButtonUnstyled>
          </CopyWithTooltip>
        </span>
      </p>
      {network === null ? (
        <>
          <p>You'll need a network configuration to interact with Vega</p>
          <p>
            <Link to={Paths.NetworkImport}>
              <Button>Import network</Button>
            </Link>
          </p>
        </>
      ) : (
        <Link to={WalletPaths.Detail}>
          <Button>View wallet</Button>
        </Link>
      )}
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
          Name: values.name,
          Passphrase: values.passphrase
        })
        if (resp) {
          setResponse(resp)
          AppToaster.show({
            message: 'Wallet created!',
            intent: Intent.SUCCESS
          })
          dispatch(addWalletAction(values.name))
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
