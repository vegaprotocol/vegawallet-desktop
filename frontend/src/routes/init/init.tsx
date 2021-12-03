import React from 'react'
import { useForm } from 'react-hook-form'
import { InitialiseApp } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Link } from 'react-router-dom'
import { BulletHeader } from '../../components/bullet-header'
import { Paths } from '../router-config'

enum FormState {
  Default,
  Pending,
  Success,
  Failure
}

interface FormFields {
  vegaHome: string
}

export function InitApp() {
  const [formState, setFormState] = React.useState(FormState.Default)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const onSubmit = async (values: FormFields) => {
    setFormState(FormState.Pending)
    try {
      await InitialiseApp({
        vegaHome: values.vegaHome
      })
      AppToaster.show({
        message: 'Application initialised!',
        color: Colors.GREEN
      })
      setFormState(FormState.Success)
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
      setFormState(FormState.Failure)
    }
  }

  return formState === FormState.Success ? (
    <>
      <BulletHeader tag='h1'>Application successfully initialised</BulletHeader>
      <Link to={Paths.Home}>
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <>
      <BulletHeader tag='h1'>Initialise application</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='Vega home'
          labelFor='vegaHome'
          errorText={errors.vegaHome?.message}
        >
          <input type='text' {...register('vegaHome')} />
        </FormGroup>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
