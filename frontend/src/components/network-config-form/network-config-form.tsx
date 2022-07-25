import React from 'react'
import type { Control, UseFormRegister } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { LogLevels } from '../../config/log-levels'
import { Validation } from '../../lib/form-validation'
import type { network as NetworkModel } from '../../wailsjs/go/models'
import { Button } from '../button'
import { FormGroup } from '../form-group'
import { Select } from '../forms'
import { Input } from '../forms/input'

interface FormFields {
  logLevel: string
  tokenExpiry: string
  port: number
  host: string
  grpcNodeRetries: number
  consoleUrl: string
  consolePort: number
  tokenDAppUrl: string
  tokenDAppPort: number
  grpcHosts: Array<{ value: string }>
  graphqlHosts: Array<{ value: string }>
  restHosts: Array<{ value: string }>
}

export interface NetworkConfigFormProps {
  config: NetworkModel.Network
  onSubmit: (config: NetworkModel.Network) => void
}

export const NetworkConfigForm = ({
  config,
  onSubmit
}: NetworkConfigFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: configToFields(config)
  })

  // If the config changes reset the fields with the new config. This happens
  // if the network dropdown is used whilst editing
  React.useEffect(() => {
    reset(configToFields(config))
  }, [config, reset])

  return (
    <form
      onSubmit={handleSubmit((values: FormFields) => {
        const configUpdate = fieldsToConfig(config, values)
        onSubmit(configUpdate)
      })}
    >
      <FormGroup
        label='Wallet Service Host'
        labelFor='host'
        intent={errors.host?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.host?.message}
      >
        <Input
          data-testid='service-host'
          type='text'
          {...register('host', {
            required: Validation.REQUIRED,
            pattern: Validation.URL
          })}
        />
      </FormGroup>
      <FormGroup
        label='Wallet Service Port'
        labelFor='port'
        intent={errors.port?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.port?.message}
      >
        <Input
          data-testid='service-port'
          type='number'
          {...register('port', {
            required: Validation.REQUIRED,
            min: Validation.NUMBER_MIN_PORT,
            max: Validation.NUMBER_MAX_PORT
          })}
        />
      </FormGroup>
      <FormGroup
        label='Console URL'
        labelFor='consoleUrl'
        intent={errors.consoleUrl?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.consoleUrl?.message}
      >
        <Input
          data-testid='console-url'
          type='text'
          {...register('consoleUrl', {
            pattern: Validation.URL
          })}
        />
      </FormGroup>
      <FormGroup
        label='Console port'
        labelFor='consolePort'
        intent={errors.consolePort?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.consolePort?.message}
      >
        <Input
          data-testid='console-port'
          type='number'
          {...register('consolePort', {
            min: Validation.NUMBER_MIN_PORT,
            max: Validation.NUMBER_MAX_PORT
          })}
        />
      </FormGroup>
      <FormGroup
        label='Token DApp URL'
        labelFor='tokenDAppUrl'
        intent={errors.tokenDAppUrl?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.tokenDAppUrl?.message}
      >
        <Input
          data-testid='token-url'
          type='text'
          {...register('tokenDAppUrl', {
            pattern: Validation.URL
          })}
        />
      </FormGroup>
      <FormGroup
        label='Token DApp port'
        labelFor='tokenDAppPort'
        intent={errors.tokenDAppPort?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.tokenDAppPort?.message}
      >
        <Input
          data-testid='token-port'
          type='number'
          {...register('tokenDAppPort', {
            min: Validation.NUMBER_MIN_PORT,
            max: Validation.NUMBER_MAX_PORT
          })}
        />
      </FormGroup>
      <h2>gRPC Nodes</h2>
      <HostEditor name='grpcHosts' control={control} register={register} />
      <h2>GraphQL Nodes</h2>
      <HostEditor name='graphqlHosts' control={control} register={register} />
      <h2>REST Nodes</h2>
      <HostEditor name='restHosts' control={control} register={register} />
      <FormGroup
        label='Log level'
        labelFor='logLevel'
        intent={errors.logLevel?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.logLevel?.message}
      >
        <Select
          data-testid='log-level'
          {...register('logLevel', { required: Validation.REQUIRED })}
        >
          {Object.values(LogLevels).map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup
        label='gRPC Node retries'
        labelFor='grpcNodeRetries'
        intent={errors.grpcNodeRetries?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.grpcNodeRetries?.message}
      >
        <Input
          data-testid='node-retries'
          type='number'
          {...register('grpcNodeRetries', {
            required: Validation.REQUIRED,
            min: Validation.NUMBER_MIN_GRPC_RETRIES,
            max: Validation.NUMBER_MAX_GRPC_RETRIES
          })}
        />
      </FormGroup>
      <FormGroup
        label='Token expiry'
        labelFor='tokenExpiry'
        intent={errors.tokenExpiry?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.tokenExpiry?.message}
      >
        <Input
          data-testid='token-expiry'
          type='text'
          {...register('tokenExpiry', {
            required: Validation.REQUIRED,
            pattern: Validation.GOLANG_DURATION
          })}
        />
      </FormGroup>
      <Button data-testid='submit' type='submit'>
        Submit
      </Button>
    </form>
  )
}

interface NodeEditorProps {
  name: string
  control: Control<FormFields, object>
  register: UseFormRegister<FormFields>
}

function HostEditor({ name, control, register }: NodeEditorProps) {
  const { fields, append, remove } = useFieldArray<FormFields, any>({
    control,
    name
  })

  return (
    <FormGroup>
      <ul style={{ marginBottom: 10 }}>
        {fields.map((field, i) => {
          return (
            <li
              key={field.id}
              style={{ display: 'flex', gap: 10, marginBottom: 5 }}
            >
              <Input
                data-testid='node-list'
                type='text'
                {...register(`${name}.${i}.value` as any)}
              />
              <Button
                data-testid='remove'
                type='button'
                disabled={fields.length <= 1}
                onClick={() => {
                  if (fields.length > 1) {
                    remove(i)
                  }
                }}
              >
                Remove
              </Button>
            </li>
          )
        })}
      </ul>
      <div>
        <Button data-testid='add' type='button' onClick={() => append('')}>
          Add
        </Button>
      </div>
    </FormGroup>
  )
}

function fieldsToConfig(
  config: NetworkModel.Network,
  values: FormFields
): NetworkModel.Network {
  // @ts-ignore ignore missing convertValues
  return {
    name: config.name,
    level: values.logLevel,
    tokenExpiry: values.tokenExpiry,
    port: Number(values.port),
    host: values.host,
    console: {
      url: values.consoleUrl,
      localPort: Number(values.consolePort)
    },
    tokenDApp: {
      url: values.tokenDAppUrl,
      localPort: Number(values.tokenDAppPort)
    },
    api: {
      grpc: {
        hosts: values.grpcHosts.map(x => x.value),
        retries: Number(values.grpcNodeRetries)
      },
      graphQl: config.api.graphQl,
      rest: config.api.rest
    }
  }
}

function configToFields(config: NetworkModel.Network): FormFields {
  return {
    logLevel: config.level as string,
    tokenExpiry: config.tokenExpiry as string,
    port: config.port,
    host: config.host,
    grpcNodeRetries: config.api.grpc.retries,
    consoleUrl: config.console.url,
    consolePort: config.console.localPort,
    tokenDAppUrl: config.tokenDApp.url,
    tokenDAppPort: config.tokenDApp.localPort,
    // @ts-ignore
    grpcHosts: config.api.grpc.hosts.map(x => ({ value: x })),
    // @ts-ignore
    graphqlHosts: config.api.graphQl.hosts.map(x => ({ value: x })),
    // @ts-ignore
    restHosts: config.api.rest.hosts.map(x => ({ value: x }))
  }
}
