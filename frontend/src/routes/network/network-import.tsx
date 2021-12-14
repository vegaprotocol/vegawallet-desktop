import { FormGroup, Intent } from '@blueprintjs/core'
import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { BulletHeader } from '../../components/bullet-header'
import { AppToaster } from '../../components/toaster'
import { addNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'

interface FormFields {
  filePath: string
  url: string
  name: string
  force: boolean
}

export function NetworkImport() {
  const { dispatch } = useNetwork()

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    formState: { errors }
  } = useForm<FormFields>()

  const filePath = useWatch({ name: 'filePath', control })
  const url = useWatch({ name: 'url', control })

  React.useEffect(() => {
    clearErrors('url')
  }, [filePath, clearErrors])

  React.useEffect(() => {
    clearErrors('filePath')
  }, [url, clearErrors])

  const onSubmit = async (values: FormFields) => {
    console.log(values)
    try {
      // TODO: Reinstate after backend is working

      // const res = await ImportNetwork({
      //   Name: values.name,
      //   URL: values.url,
      //   FilePath: values.filePath,
      //   Force: values.force
      // })
      const res = await Promise.resolve({
        Name: 'mainnet1',
        FilePath: 'fooo/bar/buzz'
      })

      if (res) {
        dispatch(addNetworkAction(res.Name))
        AppToaster.show({
          message: `Network imported from ${res.FilePath}`,
          intent: Intent.SUCCESS
        })
      } else {
        AppToaster.show({
          message: 'Error: Could not import network',
          intent: Intent.DANGER
        })
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
    }
  }

  return (
    <>
      <BulletHeader tag='h1'>Import network</BulletHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          label='* Network name'
          labelFor='name'
          intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.name?.message}>
          <input
            type='text'
            id='name'
            {...register('name', { required: 'Required' })}
          />
        </FormGroup>
        <FormGroup
          label='File path'
          labelFor='filePath'
          intent={errors.filePath?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.filePath?.message}>
          <input
            id='filePath'
            type='text'
            {...register('filePath', {
              required: url ? false : 'File path or URL required'
            })}
          />
        </FormGroup>
        <FormGroup
          label='URL'
          labelFor='url'
          intent={errors.url?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.url?.message}>
          <input
            id='url'
            type='text'
            {...register('url', {
              required: filePath ? false : 'File path or URL requried',
              pattern: {
                message: 'Invalid url',
                value: /^(http|https):\/\/[^ "]+$/i
              }
            })}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor='force'>
            <input type='checkbox' id='force' {...register('force')} />
            <span>Force (overwrite network with matching name)</span>
          </label>
        </FormGroup>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
    </>
  )
}
