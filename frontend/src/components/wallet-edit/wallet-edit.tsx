import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { ButtonGroup } from '../button-group'
import { Input } from '../forms/input'
import { FormGroup } from '../form-group'
import { Validation } from '../../lib/form-validation'
import { Intent } from '../../config/intent'
import { useCurrentWallet } from '../../hooks/use-current-wallet'
import { useGlobal } from '../../contexts/global/global-context'

type WalletEditProps = {
  onClose: () => void
}

type FormData = {
  name: string
}

export const WalletEdit = ({ onClose }: WalletEditProps) => {
  const navigate = useNavigate()
  const { dispatch, actions } = useGlobal()
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

  const onSubmit = useCallback((data: FormData) => {
    if (wallet?.name) {
      dispatch(actions.renameWallet(wallet.name, data.name, () => {
        onClose()
        navigate(`/wallets/${data.name}`)
      }))
    }
  }, [dispatch, actions, wallet?.name])

  return (
    <form
      style={{ padding: 20 }}
      onSubmit={handleSubmit(onSubmit)}
    >
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
        <Button type="submit">
          Update
        </Button>
        <ButtonUnstyled onClick={onClose}>
          Cancel
        </ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
