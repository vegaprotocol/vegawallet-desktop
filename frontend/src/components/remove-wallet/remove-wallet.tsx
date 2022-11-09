import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { Intent } from '../../config/intent'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { FormStatus } from '../../hooks/use-form-state'
import { useRemoveWallet } from '../../hooks/use-remove-wallet'
import { Validation } from '../../lib/form-validation'
import { Paths } from '../../routes'

type RemoveWalletProps = {
  onClose: () => void
}

export const RemoveWallet = ({ onClose }: RemoveWalletProps) => {
  const { wallet } = useCurrentKeypair()
  const { submit, status } = useRemoveWallet()

  if (!wallet) {
    return <Navigate to={Paths.Home} />
  }

  return (
    <div style={{ padding: '0 20px 20px' }}>
      <h2 style={{ marginBottom: 15 }}>
        Are you sure you want to remove "{wallet.name}"?
      </h2>
      <p style={{ marginBottom: 15 }}>
        Doing so will remove this wallet from your list of wallets. You will
        only be able to recover assets or re-add your wallet if you have a back
        up phrase.
      </p>
      <RemoveForm
        walletName={wallet.name}
        status={status}
        onSubmit={() => {
          submit(wallet.name)
          onClose()
        }}
        onCancel={onClose}
      />
    </div>
  )
}

interface FormFields {
  confirmText: string
}

interface DeleteFormProps {
  walletName: string
  status: FormStatus
  onSubmit: () => void
  onCancel: () => void
}

const RemoveForm = ({
  onSubmit,
  status,
  onCancel,
  walletName
}: DeleteFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const confirmText = `Remove ${walletName}`
  const isPending = status === FormStatus.Pending

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid='remove-wallet-form'>
      <FormGroup
        label={`Type: "${confirmText}" to remove this wallet`}
        labelFor='confirmText'
        helperText={errors.confirmText?.message}
        intent={errors.confirmText?.message ? Intent.DANGER : Intent.NONE}
      >
        <Input
          id='confirmText'
          {...register('confirmText', {
            required: Validation.REQUIRED,
            validate: {
              confirmText: value => {
                if (value === confirmText) {
                  return true
                }
                return 'Invalid confirmation text'
              }
            }
          })}
        />
      </FormGroup>
      <ButtonGroup inline>
        <Button type='submit' disabled={isPending} loading={isPending}>
          Remove
        </Button>
        <ButtonUnstyled onClick={onCancel}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
