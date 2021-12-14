import { Intent } from '@blueprintjs/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ImportNetwork } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'

interface FormFields {
  filePath: string
  url: string
  name: string
}

export function NetworkImport() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()

  const onSubmit = async (values: FormFields) => {
    console.log(values)
    try {
      const res = await ImportNetwork({
        Name: values.name,
        URL: values.url,
        FilePath: values.filePath,
        Force: false
      })
      console.log(res)
    } catch (err) {
      console.log(err)
      AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
    }
  }

  return (
    <>
      <BulletHeader tag='h1'>Import network</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Name'
          labelFor='name'
          errorText={errors.name?.message}>
          <input type='text' {...register('name', { required: 'Required' })} />
        </FormGroup>
        <FormGroup
          label='* File path'
          labelFor='filePath'
          errorText={errors.filePath?.message}>
          <input type='text' {...register('filePath')} autoComplete='off' />
        </FormGroup>
        <FormGroup label='* URL' labelFor='url' errorText={errors.url?.message}>
          <input type='text' {...register('url')} />
        </FormGroup>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  )
}
