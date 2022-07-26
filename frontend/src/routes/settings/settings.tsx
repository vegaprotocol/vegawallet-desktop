import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Dialog } from '../../components/dialog'
import { FormGroup } from '../../components/form-group'
import { Select } from '../../components/forms'
import { Input } from '../../components/forms/input'
import { RadioGroup } from '../../components/radio-group'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import { LogLevels } from '../../config/log-levels'
import { useGlobal } from '../../contexts/global/global-context'
import { createLogger } from '../../lib/logging'
import * as Service from '../../wailsjs/go/backend/Handler'
import { config as ConfigModel } from '../../wailsjs/go/models'

const logger = createLogger('Settings')

const useUpdateConfig = () => {
  const [status, setStatus] = useState<
    'default' | 'pending' | 'success' | 'error'
  >('default')
  const submit = async (fields: FormFields) => {
    try {
      logger.debug('UpdateAppConfig')
      setStatus('pending')
      await Service.UpdateAppConfig(
        new ConfigModel.Config({
          vegaHome: fields.vegaHome,
          logLevel: fields.logLevel
          // TODO: Fix me. Backend is broken here
          // telemetry: {
          //   enabled: fields.telemetry === 'yes' ? true : false
          // }
        })
      )
      AppToaster.show({ message: 'Config updated', intent: Intent.SUCCESS })
      setStatus('success')
    } catch (err) {
      const message = 'Failed to update config'
      AppToaster.show({ message, intent: Intent.DANGER })
      logger.error(err)
      setStatus('error')
    }
  }

  return { submit, status }
}

interface FormFields {
  vegaHome: string
  logLevel: string
  telemetry: 'yes' | 'no'
}

export function Settings() {
  const {
    state: { config }
  } = useGlobal()
  const navigate = useNavigate()

  const { submit, status } = useUpdateConfig()
  const isPending = status === 'pending'

  if (!config) {
    return null
  }

  return (
    <Dialog open={true}>
      <div>
        <SettingsForm
          config={config}
          onSubmit={submit}
          onCancel={() => navigate(-1)}
          isPending={isPending}
        />
      </div>
    </Dialog>
  )
}

interface SettingsFormProps {
  onSubmit: (fields: FormFields) => void
  onCancel: () => void
  config: ConfigModel.Config
  isPending: boolean
}

const SettingsForm = ({
  onSubmit,
  onCancel,
  config,
  isPending
}: SettingsFormProps) => {
  const { control, register, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      vegaHome: config?.vegaHome,
      logLevel: config?.logLevel,
      telemetry: config?.telemetry.enabled ? 'yes' : 'no'
    }
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label='Wallet directory'
        labelFor='vegaHome'
        helperText='This specifies where the app writes and reads its data. Warning! Changing this will remove existing wallets.'
      >
        <Input {...register('vegaHome')} />
      </FormGroup>
      <FormGroup
        label='Log level'
        labelFor='logLevel'
        helperText='Logs can be found at ~/.vega/logs'
      >
        <Select {...register('logLevel')}>
          {Object.entries(LogLevels).map(([key, value]) => (
            <option value={value} key={key}>
              {key}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup
        label='Report bugs and crashes'
        labelFor='telemetry'
        helperText='Selecting yes will help developers improve the software'
      >
        <RadioGroup
          name='telemetry'
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' }
          ]}
          control={control as any}
        />
      </FormGroup>
      <ButtonGroup>
        <Button type='submit' disabled={isPending} loading={isPending}>
          Update
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ButtonGroup>
    </form>
  )
}
