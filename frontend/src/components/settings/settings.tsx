import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { LogLevels } from '../../config/log-levels'
import { useGlobal } from '../../contexts/global/global-context'
import { FormStatus, useFormState } from '../../hooks/use-form-state'
import { createLogger } from '../../lib/logging'
import * as Service from '../../wailsjs/go/backend/Handler'
import { config as ConfigModel } from '../../wailsjs/go/models'
import { WindowReload } from '../../wailsjs/runtime/runtime'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { Dialog } from '../dialog'
import { FormGroup } from '../form-group'
import { Select } from '../forms'
import { Input } from '../forms/input'
import { RadioGroup } from '../radio-group'
import { AppToaster } from '../toaster'

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
          logLevel: fields.logLevel,
          defaultNetwork: fields.defaultNetwork,
          telemetry: new ConfigModel.TelemetryConfig({
            enabled: fields.telemetry === 'yes' ? true : false,
            consentAsked: true
          })
        })
      )
      WindowReload()
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
  defaultNetwork: string
  telemetry: 'yes' | 'no' // radio group requires string value
}

export function Settings() {
  const {
    state: { settingsModalOpen, config },
    dispatch
  } = useGlobal()

  const { submit, status } = useUpdateConfig()
  const isPending = status === FormStatus.Pending

  if (!config) {
    return null
  }

  return (
    <Dialog
      open={settingsModalOpen}
      onChange={open => dispatch({ type: 'SET_SETTINGS_MODAL', open })}
    >
      <div>
        <SettingsForm
          config={config}
          onSubmit={submit}
          onCancel={() => dispatch({ type: 'SET_SETTINGS_MODAL', open: false })}
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
      defaultNetwork: config?.defaultNetwork,
      telemetry: config?.telemetry.enabled ? 'yes' : 'no'
    }
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid='settings-form'>
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
        <Select {...register('logLevel')} data-testid='log-level'>
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
        <Button
          type='submit'
          disabled={isPending}
          loading={isPending}
          data-testid='update-settings'
        >
          Update and restart
        </Button>
        <Button onClick={onCancel} data-testid='cancel-settings'>
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  )
}
