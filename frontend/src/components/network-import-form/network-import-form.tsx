import React from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { GetNetworkConfig, ImportNetwork } from '../../api/service'
import { Header } from '../bullet-header'
import { CodeBlock } from '../code-block'
import { AppToaster } from '../toaster'
import { addNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { ImportNetworkResponse } from '../../models/network'
import { FormGroup } from '../form-group'
import { Intent } from '../../config/intent'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { Checkbox } from '../checkbox'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

interface FormFields {
  name: string
  fileOrUrl: string
  force: boolean
}

export function NetworkImportForm() {
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
      fileOrUrl: '',
      force: false
    }
  })

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
        <Header>Network imported</Header>
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

    return 'Enter a path to a configuration file for a new network, for example https://mynetwork.com/config.toml or /file/on/mysystem/config.toml'
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      {/* <FormGroup label='Import method'>
        <RadioGroup
          name='type'
          control={control}
          options={[
            { value: 'url', label: 'URL' },
            { value: 'file', label: 'File path' }
          ]}
        />
      </FormGroup> */}
      <FormGroup
        label='URL or path'
        labelFor='fileOrUrl'
        intent={errors.fileOrUrl?.message ? Intent.DANGER : Intent.NONE}
        helperText={renderFileOrUrlHelperText(errors.fileOrUrl)}>
        <input
          id='fileOrUrl'
          type='text'
          {...register('fileOrUrl', {
            required: 'Required'
          })}
        />
      </FormGroup>
      <CollapsiblePrimitive.Root
        open={advancedFields}
        onOpenChange={() => setAdvancedfields(curr => !curr)}>
        <CollapsiblePrimitive.Trigger asChild={true}>
          <p>
            <ButtonUnstyled style={{ textDecoration: 'underline' }}>
              {advancedFields ? 'Hide advanced fields' : 'Show advanced fields'}
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
      const isUrl = /^(http|https):\/\/[^ "]+$/i.test(values.fileOrUrl)
      console.log(isUrl ? 'url' : 'something else')
      try {
        const res = await ImportNetwork({
          name: values.name,
          url: isUrl ? values.fileOrUrl : '',
          filePath: !isUrl ? values.fileOrUrl : '',
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
