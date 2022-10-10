import { useForm } from 'react-hook-form'
import { Dialog } from '../dialog'
import { Button } from '../button'
import { RadioGroup } from '../radio-group'
import { Title } from '../title'
import { useGlobal } from '../../contexts/global/global-context'

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
    <Dialog open={config?.telemetry.consentAsked === false}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid='telemetry-option-form'
      >
        <Title style={{ marginTop: 0 }}>Report bugs and crashes</Title>
        <p style={{ marginBottom: '1em' }}>
          Selecting yes will help developers improve the software
        </p>
        <div style={{ marginBottom: '1em' }}>
          <RadioGroup
            name='consent'
            // TODO: Figure out how best to type the control prop
            control={control as any}
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
