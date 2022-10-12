import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Dialog } from '../../components/dialog'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { Title } from '../../components/title'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { FormStatus } from '../../hooks/use-form-state'
import { useRemoveWallet } from '../../hooks/use-remove-wallet'
import { Validation } from '../../lib/form-validation'
import { Paths } from '../../routes'

interface FormFields {
  confirmText: string
}

export const RemoveWalletDialog = () => {
  const { state, dispatch } = useGlobal()
  const { wallet } = useCurrentKeypair()
  const { submit, status } = useRemoveWallet()

  if (!wallet) {
    return <Navigate to={Paths.Home} />
  }

  return (
    <Dialog size='lg' open={state.removeWalletModalOpen}>
      <div style={{ padding: 20 }}>
        <Title
          style={{
            margin: 0,
            textTransform: 'none',
            color: Colors.WHITE,
            letterSpacing: 0,
            fontSize: 28,
            marginBottom: 32
          }}
        >
          Remove wallet
        </Title>
        <h2 style={{ marginBottom: 15 }}>
          Are you sure you want to remove "{wallet.name}"?
        </h2>
        <p style={{ marginBottom: 15 }}>
          Doing so will remove this wallet from your list of wallets. You will
          only be able to recover assets or re-add your wallet if you have a
          back up phrase.
        </p>
        <RemoveForm
          walletName={wallet.name}
          status={status}
          onSubmit={() => {
            submit(wallet.name)
            dispatch({ type: 'SET_REMOVE_WALLET_MODAL', open: false })
          }}
          onCancel={() => {
            dispatch({ type: 'SET_REMOVE_WALLET_MODAL', open: false })
          }}
        />
      </div>
    </Dialog>
  )
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
    <form onSubmit={handleSubmit(onSubmit)} data-testid='delete-wallet-form'>
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
