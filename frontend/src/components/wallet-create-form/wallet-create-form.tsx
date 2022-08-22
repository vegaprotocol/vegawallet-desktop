import React from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { FormGroup } from '../form-group'
import { Input } from '../forms/input'

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
        helperText={errors.wallet?.message}
      >
        <Input
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
        helperText={errors.passphrase?.message}
      >
        <Input
          data-testid='create-wallet-form-passphrase'
          type='password'
          {...register('passphrase', { required: Validation.REQUIRED })}
        />
      </FormGroup>
      <FormGroup
        label='Confirm passphrase'
        labelFor='confirmPassphrase'
        helperText={errors.confirmPassphrase?.message}
      >
        <Input
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
