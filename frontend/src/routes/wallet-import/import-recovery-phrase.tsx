import React from 'react'
import { ImportWallet } from '../../api/service'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { ImportWalletResponse } from '../../models/import-wallet'
import { ImportSuccess } from './import-success'
import { BulletHeader } from '../../components/bullet-header'
import { FormGroup } from '../../components/form-group'
import { Intent } from '../../config/intent'
import { Button } from '../../components/button'
import { useGlobal } from '../../contexts/global/global-context'
import { addWalletAction } from '../../contexts/global/global-actions'

interface FormFields {
  name: string
  version: number
  passphrase: string
  confirmPassphrase: string
  recoveryPhrase: string
}

export const ImportRecoveryPhrase = () => {
  const { response, submit } = useWalletImport()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>({ defaultValues: { version: 2 } })
  const passphrase = useWatch({ control, name: 'passphrase' })

  if (response) {
    return <ImportSuccess walletPath={response.WalletPath} />
  }

  return (
    <>
      <BulletHeader tag='h1'>Import wallet</BulletHeader>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup
          label='* Name'
          labelFor='name'
          helperText={errors.name?.message}>
          <input type='text' {...register('name', { required: 'Required' })} />
        </FormGroup>
        <FormGroup
          label='* Recovery phrase'
          labelFor='recoveryPhrase'
          helperText={errors.recoveryPhrase?.message}
          intent={errors.recoveryPhrase?.message ? Intent.DANGER : Intent.NONE}>
          <textarea
            {...register('recoveryPhrase', { required: 'Required' })}
            style={{ minHeight: 75 }}
          />
        </FormGroup>
        <FormGroup
          label='* Version'
          labelFor='version'
          intent={errors.version?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.version?.message}>
          <input
            type='number'
            {...register('version', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='* Choose passphrase'
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

function useWalletImport() {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<ImportWalletResponse | null>(
    null
  )

  const submit = React.useCallback(
    async (values: FormFields) => {
      try {
        const resp = await ImportWallet({
          Name: values.name,
          Passphrase: values.passphrase,
          RecoveryPhrase: values.recoveryPhrase,
          Version: values.version
        })
        if (resp) {
          setResponse(resp)
          dispatch(addWalletAction(values.name))
          AppToaster.show({
            message: 'Wallet imported!',
            intent: Intent.SUCCESS
          })
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
