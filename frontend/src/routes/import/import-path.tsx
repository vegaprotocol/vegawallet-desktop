import React from 'react'
import { useForm } from 'react-hook-form'
import { LoadWallets } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { ImportSuccess } from './import-success'

enum FormState {
  Default,
  Pending,
  Success,
  Failure
}

interface FormFields {
  rootPath: string
}

export function ImportPath() {
  const [formState, setFormState] = React.useState(FormState.Default)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const onSubmit = async (values: FormFields) => {
    setFormState(FormState.Pending)
    try {
      const success = await LoadWallets({
        RootPath: values.rootPath
      })
      if (success) {
        AppToaster.show({
          message: 'Wallet loaded!',
          color: Colors.GREEN
        })
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

  return formState === FormState.Success ? (
    <ImportSuccess />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label='* Path to wallet'
        labelFor='rootPath'
        errorText={errors.rootPath?.message}>
        <input
          id='rootPath'
          type='text'
          {...register('rootPath', { required: 'Required' })}
        />
      </FormGroup>
      <button type='submit'>Submit</button>
    </form>
  )
}
