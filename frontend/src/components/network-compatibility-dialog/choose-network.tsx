import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { RadioGroup } from '../radio-group'
import { ButtonGroup } from '../button-group'
import { Validation } from '../../lib/form-validation'

type FormData = {
  network?: string
}

type ChangeNetworkProps = {
  networks: string[]
  onAddNetwork: () => void
  onSubmit: (data: FormData) => void
  onCancel: () => void
}

export const ChangeNetwork = ({ networks, onSubmit, onCancel, onAddNetwork }: ChangeNetworkProps) => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      network: undefined,
    }
  })

  const networkOptions = useMemo(() => {
    return networks.map(n => ({ label: n, value: n }))
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }}>
      <RadioGroup
        name="network"
        control={control}
        options={networkOptions}
        rules={{
          required: Validation.REQUIRED
        }}
      />
      <ButtonUnstyled onClick={onAddNetwork} style={{ marginTop: 12 }}>
        Add network
      </ButtonUnstyled>
      <ButtonGroup inline style={{ padding: '20px 0'}}>
        <Button type="submit">
          Select network
        </Button>
        <ButtonUnstyled onClick={onCancel}>
          Cancel
        </ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
