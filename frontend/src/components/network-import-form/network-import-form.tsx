import React from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { GetNetworkConfig, ImportNetwork } from '../../api/service'
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
    reset,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      fileOrUrl: '',
      force: false
    }
  })

  React.useEffect(() => {
    if (response) {
      reset()
      setAdvancedfields(false)
    }
  }, [response, reset])

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

  const renderFileOrUrlHelperText = (error: FieldError | undefined) => {
    if (error) {
      return error.message
    }

    return 'Enter a path to a configuration file for a new network, for example https://mynetwork.com/config.toml or /file/on/mysystem/config.toml'
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
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
            <ButtonUnstyled>
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
            message: (
              <div>
                <p>Network imported to:</p>
                <p>
                  <CodeBlock style={{ background: 'transparent' }}>
                    {res.filePath}
                  </CodeBlock>
                </p>
              </div>
            ),
            intent: Intent.SUCCESS,
            timeout: 0
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
