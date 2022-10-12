import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Dialog } from '../../components/dialog'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { Header } from '../../components/header'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { useDeleteWallet } from '../../hooks/use-delete-wallet'
import { FormStatus } from '../../hooks/use-form-state'
import { Validation } from '../../lib/form-validation'
import { Paths } from '../../routes'

interface FormFields {
  confirmText: string
}

export const DeleteWalletDialog = () => {
  const { state, dispatch } = useGlobal()
  const { wallet } = useCurrentKeypair()
  const { submit, status } = useDeleteWallet()

  if (!wallet) {
    return <Navigate to={Paths.Home} />
  }

  return (
    <Dialog open={state.deleteWalletModalOpen}>
      <Header
        center={
          <div>
            <div
              style={{
                color: Colors.WHITE,
                fontSize: 20
              }}
            >
              Delete
            </div>
            <div style={{ textTransform: 'initial' }}>{wallet.name}</div>
          </div>
        }
        right={null}
      />
      <div style={{ padding: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 15 }}>
          Are you sure you want to delete this wallet?
        </h2>
        <p style={{ marginBottom: 15 }}>
          Doing so will permanently delete this wallet and you will only be able
          to recover assets if you have a back up phrase.
        </p>
        <p style={{ marginBottom: 30 }}>
          You may want to create a copy of your recovery phrase before you
          continue.
        </p>
        <DeleteForm
          walletName={wallet.name}
          status={status}
          onSubmit={() => {
            submit(wallet.name)
            dispatch({ type: 'SET_DELETE_WALLET_MODAL', open: false })
          }}
          onCancel={() => {
            dispatch({ type: 'SET_DELETE_WALLET_MODAL', open: false })
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

const DeleteForm = ({
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
  const confirmText = `Delete ${walletName}`
  const isPending = status === FormStatus.Pending

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid='delete-wallet-form'>
      <FormGroup
        label={`Type: "${confirmText}" to permanently delete this wallet`}
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
      <ButtonGroup>
        <Button type='submit' disabled={isPending} loading={isPending}>
          Delete
        </Button>
        <ButtonUnstyled onClick={onCancel}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </form>
  )
}
