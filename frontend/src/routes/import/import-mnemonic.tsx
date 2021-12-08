import React from 'react'
import { ImportWallet } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { useForm, useWatch } from 'react-hook-form'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { ImportWalletResponse } from '../../models/import-wallet'
import { ImportSuccess } from './import-success'
import { BulletHeader } from '../../components/bullet-header'

enum FormState {
  Default,
  Pending,
  Success,
  Failure
}

interface FormFields {
  name: string
  version: number
  passphrase: string
  confirmPassphrase: string
  mnemonic: string
}

export const ImportMnemonic = () => {
  const [formState, setFormState] = React.useState(FormState.Default)
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const passphrase = useWatch({ control, name: 'passphrase' })
  const [response, setResponse] = React.useState<ImportWalletResponse | null>(
    null
  )

  const onSubmit = async (values: FormFields) => {
    setFormState(FormState.Pending)
    try {
      const resp = await ImportWallet({
        Name: values.name,
        Passphrase: values.passphrase,
        Mnemonic: values.mnemonic,
        Version: values.version
      })
      if (resp) {
        setResponse(resp)
        AppToaster.show({
          message: 'Wallet imported!',
          color: Colors.GREEN
        })
        setFormState(FormState.Success)
      } else {
        AppToaster.show({ message: 'Error: Unknown', color: Colors.RED })
        setFormState(FormState.Failure)
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
      setFormState(FormState.Failure)
    }
  }

  return formState === FormState.Success && response ? (
    <ImportSuccess walletPath={response.WalletPath} />
  ) : (
    <>
      <BulletHeader tag='h1'>Import wallet</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Name'
          labelFor='name'
          errorText={errors.name?.message}>
          <input type='text' {...register('name', { required: 'Required' })} />
        </FormGroup>
        <FormGroup
          label='* Mnemonic'
          labelFor='mnemonic'
          errorText={errors.mnemonic?.message}>
          <textarea
            {...register('mnemonic', { required: 'Required' })}
            style={{ minHeight: 75 }}
          />
        </FormGroup>
        <FormGroup
          label='* Version'
          labelFor='version'
          errorText={errors.version?.message}>
          <input
            type='text'
            {...register('version', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='* Choose passphrase'
          labelFor='passphrase'
          errorText={errors.passphrase?.message}>
          <input
            type='password'
            {...register('passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='* Confirm passphrase'
          labelFor='confirmPassphrase'
          errorText={errors.confirmPassphrase?.message}>
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
