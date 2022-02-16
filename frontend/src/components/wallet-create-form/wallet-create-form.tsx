import React from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { FormGroup } from '../form-group'

interface FormFields {
  wallet: string
  passphrase: string
  confirmPassphrase: string
}

interface WalletCreateFormProps {
  submit: (fields: { wallet: string; passphrase: string }) => void
  cancel: () => void
}

export function WalletCreateForm({ submit, cancel }: WalletCreateFormProps) {
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
        label='Name'
        labelFor='wallet'
        intent={errors.wallet?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.wallet?.message}
      >
        <input
          data-testid='create-wallet-form-name'
          type='text'
          autoFocus={true}
          {...register('wallet', { required: Validation.REQUIRED })}
          autoComplete='off'
        />
      </FormGroup>
      <FormGroup
        label='Passphrase'
        labelFor='passphrase'
        intent={errors.passphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.passphrase?.message}
      >
        <input
          data-testid='create-wallet-form-passphrase'
          type='password'
          {...register('passphrase', { required: Validation.REQUIRED })}
        />
      </FormGroup>
      <FormGroup
        label='Confirm passphrase'
        labelFor='confirmPassphrase'
        intent={errors.confirmPassphrase?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.confirmPassphrase?.message}
      >
        <input
          data-testid='create-wallet-form-passphrase-confirm'
          type='password'
          {...register('confirmPassphrase', {
            required: Validation.REQUIRED,
            pattern: Validation.match(passphrase)
          })}
        />
      </FormGroup>
      <ButtonGroup>
        <Button data-testid='submit' type='submit'>
          Submit
        </Button>
        <Button onClick={cancel}>Cancel</Button>
      </ButtonGroup>
    </form>
  )
}
