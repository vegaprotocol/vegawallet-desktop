import React from 'react'
import { FieldError, useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { GetNetworkConfig, ImportNetwork } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { CodeBlock } from '../../components/code-block'
import { AppToaster } from '../../components/toaster'
import { addNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { ImportNetworkResponse } from '../../models/network'
import { FormGroup } from '../../components/form-group'
import { Intent } from '../../config/intent'
import { Button } from '../../components/button'
import { RadioGroup } from '../../components/radio-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Checkbox } from '../../components/checkbox'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

interface FormFields {
  name: string
  type: 'file' | 'url'
  fileOrUrl: string
  force: boolean
}

export function NetworkImport() {
  const [advancedFields, setAdvancedfields] = React.useState(false)
  const { response, submit, error } = useImportNetwork()
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      type: 'url',
      fileOrUrl: '',
      force: false
    }
  })

  const type = useWatch({ name: 'type', control })
  const isURLType = type === 'url'

  // If an error is set and its the 'wallet already exists' error, open the advanced fields section
  // set the namee
  React.useEffect(() => {
    if (error && /already exists/.test(error)) {
      setAdvancedfields(true)
      setError(
        'name',
        { message: 'Network with name already exists' },
        { shouldFocus: true }
      )
    }
  }, [error, setError])

  if (response) {
    return (
      <>
        <BulletHeader tag='h1'>Network imported</BulletHeader>
        <p>Location</p>
        <p style={{ position: 'relative' }}>
          <CodeBlock>{response.filePath}</CodeBlock>
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to={`/network/${response.name}`}>
            <Button>View {response.name} configuration</Button>
          </Link>
          <Link to={`/network/${response.name}/edit`}>
            <Button>Edit {response.name} configuration</Button>
          </Link>
        </div>
      </>
    )
  }

  const renderFileOrUrlHelperText = (error: FieldError | undefined) => {
    if (error) {
      return error.message
    }

    if (isURLType) {
      return 'URL to raw text file'
    }

    return 'Path to file on your computer'
  }

  return (
    <>
      <BulletHeader tag='h1'>Import network</BulletHeader>
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup label='Import method'>
          <RadioGroup
            name='type'
            control={control}
            options={[
              { value: 'url', label: 'URL' },
              { value: 'file', label: 'File path' }
            ]}
          />
        </FormGroup>
        <FormGroup
          label={isURLType ? '* URL' : '* File path'}
          labelFor='fileOrUrl'
          intent={errors.fileOrUrl?.message ? Intent.DANGER : Intent.NONE}
          helperText={renderFileOrUrlHelperText(errors.fileOrUrl)}>
          <input
            id='fileOrUrl'
            type='text'
            {...register('fileOrUrl', {
              required: 'Required',
              pattern: isURLType
                ? {
                    message: 'Invalid url',
                    value: /^(http|https):\/\/[^ "]+$/i
                  }
                : undefined
            })}
          />
        </FormGroup>
        <CollapsiblePrimitive.Root
          open={advancedFields}
          onOpenChange={() => setAdvancedfields(curr => !curr)}>
          <CollapsiblePrimitive.Trigger asChild={true}>
            <p>
              <ButtonUnstyled style={{ textDecoration: 'underline' }}>
                {advancedFields
                  ? 'Hide advanced fields'
                  : 'Show advanced fields'}
              </ButtonUnstyled>
            </p>
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Content>
            <>
              <FormGroup
                label='Network name'
                labelFor='name'
                intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
                helperText={
                  errors.name
                    ? errors.name?.message
                    : 'Uses name specified in config by default'
                }>
                <input type='text' id='name' {...register('name')} />
              </FormGroup>
              <FormGroup helperText='Overwrite existing network configuration if it already exists'>
                <Checkbox name='force' control={control} label='Overwrite' />
              </FormGroup>
            </>
          </CollapsiblePrimitive.Content>
        </CollapsiblePrimitive.Root>
        <div>
          <Button type='submit'>Submit</Button>
        </div>
      </form>
    </>
  )
}

function useImportNetwork() {
  const { dispatch } = useNetwork()
  const [response, setResponse] = React.useState<ImportNetworkResponse | null>(
    null
  )
  const [error, setError] = React.useState<string | null>(null)

  const submit = React.useCallback(
    async (values: FormFields) => {
      try {
        const res = await ImportNetwork({
          name: values.name,
          url: values.type === 'url' ? values.fileOrUrl : '',
          filePath: values.type === 'file' ? values.fileOrUrl : '',
          force: values.force
        })

        if (res) {
          setResponse(res)
          const config = await GetNetworkConfig(res.name)

          dispatch(addNetworkAction(res.name, config))

          AppToaster.show({
            message: 'Network imported',
            intent: Intent.SUCCESS
          })
        } else {
          const message = 'Error: Could not import network'
          setError(message)
          AppToaster.show({
            message,
            intent: Intent.DANGER
          })
        }
      } catch (err) {
        // @ts-ignore
        setError(err)
        AppToaster.show({
          message: `Error: ${err}`,
          intent: Intent.DANGER
        })
      }
    },
    [dispatch]
  )

  return {
    response,
    submit,
    error
  }
}
