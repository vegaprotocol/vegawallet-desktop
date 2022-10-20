import { useForm } from 'react-hook-form'

import { useGlobal } from '../../contexts/global/global-context'
import { Button } from '../button'
import { Dialog } from '../dialog'
import { RadioGroup } from '../radio-group'

export const TelemetryDialog = () => {
  const {
    state: { config },
    actions,
    dispatch
  } = useGlobal()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      consent: 'no'
    }
  })

  const onSubmit = (data: { consent: string }) => {
    dispatch(
      actions.updateTelemetry({
        consentAsked: true,
        enabled: data.consent === 'yes'
      })
    )
  }

  return (
    <Dialog
      open={config?.telemetry.consentAsked === false}
      title='Report bugs and crashes'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid='telemetry-option-form'
        style={{ padding: '0 20px 20px' }}
      >
        <p style={{ marginBottom: '1em' }}>
          Selecting yes will help developers improve the software
        </p>
        <div style={{ marginBottom: '1em' }}>
          <RadioGroup
            name='consent'
            control={control}
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' }
            ]}
          />
        </div>
        <Button type='submit' data-testid='telemetry-option-continue'>
          Continue
        </Button>
      </form>
    </Dialog>
  )
}
