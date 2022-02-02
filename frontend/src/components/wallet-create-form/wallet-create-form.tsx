import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Intent } from '../../config/intent'
import { Button } from '../button'
import { FormGroup } from '../form-group'

interface FormFields {
  wallet: string
  passphrase: string
  confirmPassphrase: string
}

interface WalletCreateFormProps {
  submit: (fields: { wallet: string; passphrase: string }) => void
}

export function WalletCreateForm({ submit }: WalletCreateFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const passphrase = useWatch({ control, name: 'passphrase' })

  return (
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
        intent={errors.confirmPassphrase?.message ? Intent.DANGER : Intent.NONE}
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
  )
}
