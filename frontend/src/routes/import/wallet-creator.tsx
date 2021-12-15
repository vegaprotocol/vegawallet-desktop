import React from 'react'
import { CreateWallet } from '../../api/service'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { CreateWalletResponse } from '../../models/create-wallet'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'
import { useGlobal } from '../../contexts/global/global-context'
import { addWalletAction } from '../../contexts/global/global-actions'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { CopyWithTooltip } from '../../components/copy-with-tooltip'
import { Copy } from '../../components/icons/copy'
import { WalletPaths } from '../home'
import { FormGroup, Intent } from '@blueprintjs/core'

interface FormFields {
  name: string
  passphrase: string
  confirmPassphrase: string
}

export const WalletCreator = () => {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const passphrase = useWatch({ control, name: 'passphrase' })

  const onSubmit = async (values: FormFields) => {
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
  }

  if (response) {
    return (
      <>
        <BulletHeader tag='h1'>Wallet created</BulletHeader>
        <p>
          Here is your recovery phrase. Please take note of the words below as
          you will need these to restore your wallet!
        </p>
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
        <Link to={WalletPaths.Home}>
          <button>View wallet</button>
        </Link>
      </>
    )
  }

  return (
    <>
      <BulletHeader tag='h1'>Create wallet</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  )
}
