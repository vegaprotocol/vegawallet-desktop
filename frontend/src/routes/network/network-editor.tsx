import React from 'react'
import { useForm } from 'react-hook-form'
import { SaveNetworkConfig } from '../../api/service'
import { FormGroup } from '../../components/form-group'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
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
}

export interface ConfigEditorProps {
  config: Network
  setConfig: React.Dispatch<React.SetStateAction<Network | null>>
}

export const NetworkEditor = ({ config, setConfig }: ConfigEditorProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      logLevel: config.Level,
      tokenExpiry: config.TokenExpiry,
      port: config.Port,
      host: config.Host,
      grpcNodeRetries: config.API.GRPC.Retries,
      consoleUrl: config.Console.URL,
      consolePort: config.Console.LocalPort
    }
  })

  const onSubmit = async (values: FormFields) => {
    try {
      const configUpdate: Network = {
        Name: config.Name,
        Level: values.logLevel,
        TokenExpiry: values.tokenExpiry,
        Port: Number(values.port),
        Host: values.host,
        Console: {
          URL: values.consoleUrl,
          LocalPort: Number(values.consolePort)
        },
        API: {
          GRPC: {
            Hosts: config.API.GRPC.Hosts,
            Retries: Number(values.grpcNodeRetries)
          },
          GraphQL: config.API.GraphQL,
          REST: config.API.REST
        }
      }
      const success = await SaveNetworkConfig(configUpdate)
      if (success) {
        setConfig(configUpdate)
        AppToaster.show({
          message: 'Configuration saved!',
          color: Colors.GREEN
        })
      } else {
        AppToaster.show({ message: 'Error: Unknown', color: Colors.RED })
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button type='submit'>Submit</button>
    </form>
  )
}
