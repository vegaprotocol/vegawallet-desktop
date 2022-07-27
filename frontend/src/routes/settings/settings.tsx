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
import { FormStatus, useFormState } from '../../hooks/use-form-state'
import { createLogger } from '../../lib/logging'
import * as Service from '../../wailsjs/go/backend/Handler'
import { config as ConfigModel } from '../../wailsjs/go/models'

const logger = createLogger('Settings')

const useUpdateConfig = () => {
  const [status, setStatus] = useFormState()
  const submit = async (fields: FormFields) => {
    try {
      logger.debug('UpdateAppConfig')
      setStatus(FormStatus.Pending)
      await Service.UpdateAppConfig(
        new ConfigModel.Config({
          vegaHome: fields.vegaHome,
          logLevel: fields.logLevel
          // TODO: Saving telemetry seems to be broken
          // telemetry: new ConfigModel.TelemetryConfig({
          //   enabled: fields.telemetry === 'yes' ? true : false,
          //   consentAsked: false
          // })
        })
      )
    } catch (err) {
      const message = 'Failed to update config'
      AppToaster.show({ message, intent: Intent.DANGER })
      logger.error(err)
      setStatus(FormStatus.Error)
    } finally {
      setStatus(FormStatus.Default)
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
  const isPending = status === FormStatus.Pending

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
        helperText='Logs can be found at in your Vega home directory'
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
      <ButtonGroup orientation='vertical'>
        <Button type='submit' disabled={isPending} loading={isPending}>
          Update and restart
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </ButtonGroup>
    </form>
  )
}
