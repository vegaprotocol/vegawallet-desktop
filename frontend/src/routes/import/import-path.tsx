import React from 'react'
import { useForm } from 'react-hook-form'
import { LoadWallets } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Link } from 'react-router-dom'
import { LoadWalletsResponse } from '../../models/load-wallets'

enum FormState {
  Default,
  Pending,
  Success,
  Failure
}

interface FormFields {
  vegaHome: string
}

export function ImportPath() {
  const [formState, setFormState] = React.useState(FormState.Default)
  const [response, setResponse] = React.useState<LoadWalletsResponse | null>(
    null
  )
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const onSubmit = async (values: FormFields) => {
    setFormState(FormState.Pending)
    try {
      const resp = await LoadWallets({
        VegaHome: values.vegaHome
      })
      if (resp) {
        AppToaster.show({
          message: 'Wallet loaded!',
          color: Colors.GREEN
        })
        setResponse(resp)
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
    <>
      <p>Wallets successfully loaded from:</p>
      <pre className='wallet-creator__mnemonic'>{response.WalletsPath}</pre>
      <Link to='/'>
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label='Vega home (leave blank for defaults)'
        labelFor='vegaHome'
        errorText={errors.vegaHome?.message}>
        <input type='text' {...register('vegaHome')} />
      </FormGroup>
      <button type='submit'>Submit</button>
    </form>
  )
}
