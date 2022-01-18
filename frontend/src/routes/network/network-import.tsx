import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { NetworkPaths } from '.'
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
  input: string
  force: boolean
}

export function NetworkImport() {
  const [advancedFields, setAdvancedfields] = React.useState(false)
  const { response, submit } = useImportNetwork()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      type: 'file',
      input: '',
      force: false
    }
  })

  const type = useWatch({ name: 'type', control })
  const isURLType = type === 'url'

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
        <FormGroup>
          <RadioGroup
            name='type'
            control={control}
            options={[
              { value: 'file', label: 'Import by file' },
              { value: 'url', label: 'Import by URL' }
            ]}
          />
        </FormGroup>

        <FormGroup
          label={isURLType ? '* URL' : '* File path'}
          labelFor='input'
          intent={errors.input?.message ? Intent.DANGER : Intent.NONE}
          helperText={errors.input?.message}>
          <input
            id='input'
            type='text'
            {...register('input', {
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
          <CollapsiblePrimitive.Content>
            <>
              <FormGroup
                label='Network name'
                labelFor='name'
                intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
                helperText={errors.name?.message}>
                <input type='text' id='name' {...register('name')} />
              </FormGroup>
              <FormGroup>
                <Checkbox
                  name='force'
                  control={control}
                  label='Force (overwrite network with matching name)'
                />
              </FormGroup>
            </>
          </CollapsiblePrimitive.Content>
          <CollapsiblePrimitive.Trigger asChild={true}>
            <p>
              <ButtonUnstyled style={{ textDecoration: 'underline' }}>
                {advancedFields
                  ? 'Hide advanced fields'
                  : 'Show advanced fields'}
              </ButtonUnstyled>
            </p>
          </CollapsiblePrimitive.Trigger>
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

  const submit = React.useCallback(
    async (values: FormFields) => {
      try {
        const res = await ImportNetwork({
          name: values.name,
          url: values.type === 'url' ? values.input : '',
          filePath: values.type === 'file' ? values.input : '',
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
    [dispatch]
  )

  return {
    response,
    submit
  }
}
