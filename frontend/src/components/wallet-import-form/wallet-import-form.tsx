import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Intent } from '../../config/intent'
import { Button } from '../button'
import { FormGroup } from '../form-group'

interface FormFields {
  wallet: string
  version: number
  passphrase: string
  confirmPassphrase: string
  recoveryPhrase: string
}

interface WalletImportFormProps {
  submit: (values: {
    wallet: string
    passphrase: string
    recoveryPhrase: string
    version: number
  }) => Promise<void>
}

export function WalletImportForm({ submit }: WalletImportFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const passphrase = useWatch({ control, name: 'passphrase' })

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormGroup
        label='* Name'
        labelFor='wallet'
        helperText={errors.wallet?.message}
      >
        <input type='text' {...register('wallet', { required: 'Required' })} />
      </FormGroup>
      <FormGroup
        label='* Recovery phrase'
        labelFor='recoveryPhrase'
        helperText={errors.recoveryPhrase?.message}
        intent={errors.recoveryPhrase?.message ? Intent.DANGER : Intent.NONE}
      >
        <textarea
          {...register('recoveryPhrase', { required: 'Required' })}
          style={{ minHeight: 75 }}
        />
      </FormGroup>
      <FormGroup
        label='* Version'
        labelFor='version'
        intent={errors.version?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.version?.message}
      >
        <input
          type='number'
          {...register('version', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Choose passphrase'
        labelFor='passphrase'
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.passphrase?.message}
      >
        <input
          type='password'
          {...register('passphrase', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Confirm passphrase'
        labelFor='confirmPassphrase'
        intent={errors.confirmPassphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.confirmPassphrase?.message}
      >
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
  )
}
