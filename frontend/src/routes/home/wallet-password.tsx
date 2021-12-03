import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { WalletPaths } from '.'
import { ListKeys } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { setKeypairsAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

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
        wallet: state.wallet.name,
        passphrase: values.Passphrase
      })
      dispatch(
        setKeypairsAction(state.wallet.name, keys.keys || [], values.Passphrase)
      )
      history.push(WalletPaths.Home)
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  if (!state.wallet) {
    return <Redirect to={Paths.Home} />
  }

  if (state.wallet.keypairs !== null) {
    return <Redirect to={WalletPaths.Home} />
  }

  return (
    <>
      <div>
        <Link to={Paths.Home}>Back</Link>
      </div>
      <BulletHeader tag='h1'>{state.wallet.name}</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Passphrase'
          labelFor='Passphrase'
          errorText={errors.Passphrase?.message}>
          <input
            type='password'
            autoFocus={true}
            {...register('Passphrase', { required: 'Required' })}
          />
        </FormGroup>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
