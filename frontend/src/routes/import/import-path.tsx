import React from 'react'
import { useForm } from 'react-hook-form'
import { LoadWallets } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Link } from 'react-router-dom'
import { LoadWalletsResponse } from '../../models/load-wallets'
import { CodeBlock } from '../../components/code-block'
import { BulletHeader } from '../../components/bullet-header'
import { Paths } from '../router-config'

enum FormState {
  Default,
  Pending,
  Success,
  Failure
}

interface FormFields {
  path: string
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
        VegaHome: values.path
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
      <BulletHeader tag='h1'>Wallets successfully imported</BulletHeader>
      <p>
        <CodeBlock>{response.WalletsPath}</CodeBlock>
      </p>
      <Link to={Paths.Home}>
        <button>View wallets</button>
      </Link>
    </>
  ) : (
    <>
      <BulletHeader tag='h1'>Import wallet</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='Path to wallet'
          labelFor='path'
          errorText={errors.path?.message}>
          <input type='text' {...register('path')} />
        </FormGroup>
        <button type='submit'>Submit</button>
      </form>
    </>
  )
}
