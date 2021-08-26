import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { FormGroup } from '../../components/form-group'

interface FormFields {
  passphrase: string
}

export function WalletAuth({ name, onSubmit }: any) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  return (
    <>
      <BulletHeader tag='h1'>
        {name} / <Link to='/'>Back</Link>
      </BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Passphrase'
          labelFor='passphrase'
          errorText={errors.passphrase?.message}>
          <input
            type='password'
            {...register('passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  )
}
