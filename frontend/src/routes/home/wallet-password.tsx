import React from 'react'
import { useForm } from 'react-hook-form'
import { Redirect, useHistory } from 'react-router-dom'
import { ListKeys } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'

interface FormFields {
  Passphrase: string
}

export function WalletPassword() {
  const history = useHistory()
  const { state, dispatch } = useGlobal()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const onSubmit = async (values: FormFields) => {
    try {
      const keys = await ListKeys({
        Name: state.wallet,
        Passphrase: values.Passphrase
      })
      dispatch({ type: 'SET_KEYPAIRS', keypairs: keys.KeyPairs || [] })
      history.push('/wallet')
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  if (!state.wallet) {
    return <Redirect to='/' />
  }

  return (
    <>
      <BulletHeader tag='h1'>{state.wallet}</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Passphrase'
          labelFor='Passphrase'
          errorText={errors.Passphrase?.message}>
          <input
            type='password'
            {...register('Passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
