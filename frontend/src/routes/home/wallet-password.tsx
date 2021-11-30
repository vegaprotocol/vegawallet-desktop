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
    if (!state.wallet) {
      throw new Error('No wallet set')
    }

    try {
      const keys = await ListKeys({
        Name: state.wallet.name,
        Passphrase: values.Passphrase
      })
      dispatch({
        type: 'SET_KEYPAIRS',
        wallet: state.wallet.name,
        keypairs: keys.KeyPairs || []
      })
      history.push('/wallet')
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  if (!state.wallet) {
    return <Redirect to='/' />
  }

  if (state.wallet.keypairs !== null) {
    return <Redirect to='/wallet' />
  }

  return (
    <>
      <BulletHeader tag='h1'>{state.wallet.name}</BulletHeader>
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
