import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { Intent } from '../../config/intent'
import { useCurrentWallet } from '../../hooks/use-current-wallet'
import { useRenameWallet } from '../../hooks/use-rename-wallet'
import { Validation } from '../../lib/form-validation'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { FormGroup } from '../form-group'
import { Input } from '../forms/input'

type WalletEditProps = {
  onClose: () => void
}

type FormData = {
  name: string
}

export const WalletEdit = ({ onClose }: WalletEditProps) => {
  const { rename } = useRenameWallet()
  const { wallet } = useCurrentWallet()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: wallet?.name ?? ''
    }
  })

  const onSubmit = useCallback(
    (data: FormData) => {
      if (wallet?.name) {
        rename(wallet.name, data.name)
      }
    },
    [rename, wallet?.name]
  )

  return (
    <form style={{ padding: 20 }} onSubmit={handleSubmit(onSubmit)}>
      <FormGroup
        label='Name'
        labelFor='name'
        intent={errors.name?.message ? Intent.DANGER : Intent.NONE}
        helperText={errors.name?.message}
      >
        <Input
          {...register('name', {
            required: Validation.REQUIRED
          })}
        />
      </FormGroup>
      <ButtonGroup inline>
        <Button type='submit'>Update</Button>
        <ButtonUnstyled onClick={onClose}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
