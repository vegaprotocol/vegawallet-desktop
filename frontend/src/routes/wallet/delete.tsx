import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { FormStatus, useFormState } from '../../hooks/use-form-state'
import { Validation } from '../../lib/form-validation'
import { createLogger } from '../../lib/logging'
import { Paths } from '..'
import { WalletHeader } from './wallet-header'

const logger = createLogger('Delete')

const useDeleteWallet = () => {
  const navigate = useNavigate()
  const { dispatch, service } = useGlobal()
  const [status, setStatus] = useFormState()
  const submit = useCallback(
    async (walletName: string) => {
      try {
        setStatus(FormStatus.Pending)
        logger.debug(`DeleteWallet: ${walletName}`)
        const res = await service.WalletApi.RemoveWallet({ wallet: walletName })
        if (res instanceof Error) {
          throw res
        } else {
          AppToaster.show({ message: 'Wallet deleted', intent: Intent.SUCCESS })
          setStatus(FormStatus.Success)
          dispatch({ type: 'REMOVE_WALLET', wallet: walletName })
          navigate(Paths.Home)
        }
      } catch (err) {
        AppToaster.show({
          message: 'Failed to delete wallet',
          intent: Intent.DANGER
        })
        setStatus(FormStatus.Error)
        logger.error(err)
      }
    },
    [dispatch, navigate, service, setStatus]
  )

  return { status, submit }
}

interface FormFields {
  confirmText: string
}

export const Delete = () => {
  const navigate = useNavigate()
  const { wallet } = useCurrentKeypair()
  const { submit, status } = useDeleteWallet()

  if (!wallet) {
    return <Navigate to={Paths.Home} />
  }

  return (
    <>
      <WalletHeader
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
          onSubmit={() => submit(wallet.name)}
          onCancel={() => navigate(-1)}
        />
      </div>
    </>
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
        <Button onClick={onCancel}>Cancel</Button>
      </ButtonGroup>
    </form>
  )
}
