import React from 'react'
import {
  Control,
  useFieldArray,
  useForm,
  UseFormRegister
} from 'react-hook-form'
import { FormGroup } from '../../components/form-group'
import { LogLevels } from '../../config/log-levels'
import type { Network } from '../../models/network'

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
      })}>
      <FormGroup
        label='* Log level'
        labelFor='logLevel'
        errorText={errors.logLevel?.message}>
        <select {...register('logLevel', { required: 'Required' })}>
          {Object.values(LogLevels).map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </FormGroup>
      <FormGroup
        label='* Token expiry'
        labelFor='tokenExpiry'
        errorText={errors.tokenExpiry?.message}>
        <input
          type='text'
          {...register('tokenExpiry', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Port'
        labelFor='port'
        errorText={errors.port?.message}>
        <input type='text' {...register('port', { required: 'Required' })} />
      </FormGroup>
      <FormGroup
        label='* Host'
        labelFor='host'
        errorText={errors.host?.message}>
        <input type='text' {...register('host', { required: 'Required' })} />
      </FormGroup>
      <FormGroup
        label='*gRPC Node retries'
        labelFor='grpcNodeRetries'
        errorText={errors.grpcNodeRetries?.message}>
        <input
          type='text'
          {...register('grpcNodeRetries', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Console URL'
        labelFor='consoleUrl'
        errorText={errors.consoleUrl?.message}>
        <input
          type='text'
          {...register('consoleUrl', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Console port'
        labelFor='consolePort'
        errorText={errors.consolePort?.message}>
        <input
          type='text'
          {...register('consolePort', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Token DApp URL'
        labelFor='tokenDAppUrl'
        errorText={errors.tokenDAppUrl?.message}>
        <input
          type='text'
          {...register('tokenDAppUrl', { required: 'Required' })}
        />
      </FormGroup>
      <FormGroup
        label='* Token DApp port'
        labelFor='tokenDAppPort'
        errorText={errors.tokenDAppPort?.message}>
        <input
          type='text'
          {...register('tokenDAppPort', { required: 'Required' })}
        />
      </FormGroup>
      <h2>gRPC Nodes</h2>
      <HostEditor name='grpcHosts' control={control} register={register} />
      <h2>GraphQL Nodes</h2>
      <HostEditor name='graphqlHosts' control={control} register={register} />
      <h2>REST Nodes</h2>
      <HostEditor name='restHosts' control={control} register={register} />
      <button type='submit'>Submit</button>
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
              style={{ display: 'flex', gap: 10, marginBottom: 5 }}>
              <input type='text' {...register(`${name}.${i}.value` as any)} />
              <button
                type='button'
                disabled={fields.length <= 1}
                onClick={() => {
                  if (fields.length > 1) {
                    remove(i)
                  }
                }}>
                Remove
              </button>
            </li>
          )
        })}
      </ul>
      <div>
        <button type='button' onClick={() => append('')}>
          Add
        </button>
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
