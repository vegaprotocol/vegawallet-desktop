import React from 'react'
import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister
} from 'react-hook-form'
import { LogLevels } from '../../config/log-levels'
import type { Network } from '../../models/network'
import { FormGroup } from '../form-group'
import { Intent } from '../../config/intent'
import { Button } from '../button'
import { Validation } from '../../lib/form-validation'

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
  config: Network
  onSubmit: (config: Network) => void
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
        label='REST Service Host'
        labelFor='host'
        intent={errors.host?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.host?.message}
      >
        <input
          data-testid='service-host'
          type='text'
          {...register('host', {
            required: Validation.REQUIRED,
            pattern: Validation.URL
          })}
        />
      </FormGroup>
      <FormGroup
        label='REST Service Port'
        labelFor='port'
        intent={errors.port?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.port?.message}
      >
        <input
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
        <input
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
        <input
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
        <input
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
        <input
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
        <select data-testid='log-level' {...register('logLevel', { required: Validation.REQUIRED })}>
          {Object.values(LogLevels).map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </FormGroup>
      <FormGroup
        label='gRPC Node retries'
        labelFor='grpcNodeRetries'
        intent={errors.grpcNodeRetries?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.grpcNodeRetries?.message}
      >
        <input
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
        <input
          data-testid='token-expiry'
          type='text'
          {...register('tokenExpiry', {
            required: Validation.REQUIRED,
            pattern: Validation.GOLANG_DURATION
          })}
        />
      </FormGroup>
      <Button data-testid='submit' type='submit'>Submit</Button>
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
              <input data-testid='node-list' type='text' {...register(`${name}.${i}.value` as any)} />
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

function fieldsToConfig(config: Network, values: FormFields): Network {
  return {
    Name: config.Name,
    Level: values.logLevel,
    TokenExpiry: values.tokenExpiry,
    Port: Number(values.port),
    Host: values.host,
    Console: {
      URL: values.consoleUrl,
      LocalPort: Number(values.consolePort)
    },
    TokenDApp: {
      URL: values.tokenDAppUrl,
      LocalPort: Number(values.tokenDAppPort)
    },
    API: {
      GRPC: {
        Hosts: values.grpcHosts.map(x => x.value),
        Retries: Number(values.grpcNodeRetries)
      },
      GraphQL: config.API.GraphQL,
      REST: config.API.REST
    }
  }
}

function configToFields(config: Network): FormFields {
  return {
    logLevel: config.Level,
    tokenExpiry: config.TokenExpiry,
    port: config.Port,
    host: config.Host,
    grpcNodeRetries: config.API.GRPC.Retries,
    consoleUrl: config.Console.URL,
    consolePort: config.Console.LocalPort,
    tokenDAppUrl: config.TokenDApp.URL,
    tokenDAppPort: config.TokenDApp.LocalPort,
    grpcHosts: config.API.GRPC.Hosts.map(x => ({ value: x })),
    graphqlHosts: config.API.GraphQL.Hosts.map(x => ({ value: x })),
    restHosts: config.API.REST.Hosts.map(x => ({ value: x }))
  }
}
