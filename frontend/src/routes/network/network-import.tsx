import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'
import { AppToaster } from '../../components/toaster'
import { addNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { ImportNetworkResponse } from '../../models/network'
import { FormGroup } from '../../components/form-group'
import { Intent } from '../../config/intent'
import { Button } from '../../components/button'
import { useBackend } from '../../contexts/backend/backend-context'

interface FormFields {
  filePath: string
  url: string
  name: string
  force: boolean
}

export function NetworkImport() {
  const { response, submit } = useImportNetwork()
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

  if (response) {
    return (
      <>
        <BulletHeader tag='h1'>Network imported</BulletHeader>
        <p>Location</p>
        <p style={{ position: 'relative' }}>
          <CodeBlock>{response.filePath}</CodeBlock>
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={NetworkPaths.Config}>
            <Button>View {response.name} configuration</Button>
          </Link>
          <Link to={NetworkPaths.Edit}>
            <Button>Edit {response.name} configuration</Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <BulletHeader tag='h1'>Import network</BulletHeader>
      <form onSubmit={handleSubmit(submit)}>
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
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </>
  )
}

function useImportNetwork() {
  const service = useBackend()
  const { dispatch } = useNetwork()
  const [response, setResponse] = React.useState<ImportNetworkResponse | null>(
    null
  )

  const submit = React.useCallback(
    async (values: FormFields) => {
      try {
        const res = await service.ImportNetwork({
          name: values.name,
          url: values.url,
          filePath: values.filePath,
          force: values.force
        })

        if (res) {
          setResponse(res)
          const config = await service.GetNetworkConfig(res.name)

          dispatch(addNetworkAction(res.name, config))

          AppToaster.show({
            message: 'Network imported',
            intent: Intent.SUCCESS
          })
        } else {
          AppToaster.show({
            message: 'Error: Could not import network',
            intent: Intent.DANGER
          })
        }
      } catch (err) {
        AppToaster.show({
          message: `Error: ${err}`,
          intent: Intent.DANGER
        })
      }
    },
    [dispatch, service]
  )

  return {
    response,
    submit
  }
}
