import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { Dialog } from '../../components/dialog'
import { FormGroup } from '../../components/form-group'
import { Select } from '../../components/forms'
import { Input } from '../../components/forms/input'
import { RadioGroup } from '../../components/radio-group'
import { useGlobal } from '../../contexts/global/global-context'
import * as Service from '../../wailsjs/go/backend/Handler'
import { config as ConfigModel } from '../../wailsjs/go/models'

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
  const { control, register, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      vegaHome: config?.vegaHome,
      logLevel: config?.logLevel,
      telemetry: config?.telemetry.enabled ? 'yes' : 'no'
    }
  })

  const onSubmit = async (fields: FormFields) => {
    console.log(fields)
    try {
      const res = await Service.UpdateAppConfig(
        new ConfigModel.Config({
          vegaHome: fields.vegaHome,
          logLevel: fields.logLevel
        })
      )
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={true}>
      <div>
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
              <option value='info'>Info</option>
              <option value='debug'>Debug</option>
              <option value='warn'>Warn</option>
              <option value='error'>Error</option>
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
            <Button type='submit'>Update</Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </ButtonGroup>
        </form>
      </div>
    </Dialog>
  )
}
