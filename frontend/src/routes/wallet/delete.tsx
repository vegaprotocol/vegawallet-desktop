import * as Sentry from '@sentry/react'
import { logger } from '@sentry/utils'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { FormGroup } from '../../components/form-group'
import { Input } from '../../components/forms/input'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { FormStatus, useFormState } from '../../hooks/use-form-state'
import * as Service from '../../wailsjs/go/backend/Handler'
import { backend as BackendModel } from '../../wailsjs/go/models'
import { Paths } from '..'

interface FormFields {
  confirmText: string
}

export const Delete = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const { wallet } = useCurrentKeypair()
  const { submit, status } = useDeleteWallet()

  if (!wallet) {
    return <Navigate to={Paths.Home} />
  }

  const confirmText = `Delete ${wallet.name}`
  const isPending = status === FormStatus.Pending

  return (
    <div style={{ padding: 20 }}>
      <p style={{ marginBottom: 15 }}>
        Are you sure you want to delete this wallet?
      </p>
      <p style={{ marginBottom: 15 }}>
        Doing so will permanently delete this wallet and you will only be able
        to recover assets if you have a back up phrase.
      </p>
      <p style={{ marginBottom: 15 }}>
        You may want to create a copy of your recovery phrase before you
        continue.
      </p>
      <form onSubmit={handleSubmit(() => submit(wallet.name))}>
        <FormGroup
          label={`Type: "${confirmText}" to permanently delete this wallet`}
          labelFor='confirmText'
          helperText={errors.confirmText?.message}
          intent={errors.confirmText?.message ? Intent.DANGER : Intent.NONE}
        >
          <Input
            id='confirmText'
            {...register('confirmText', {
              required: 'Required',
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
          <Button onClick={() => navigate(-1)}>Cancel</Button>
        </ButtonGroup>
      </form>
    </div>
  )
}

const useDeleteWallet = () => {
  const navigate = useNavigate()
  const { dispatch } = useGlobal()
  const [status, setStatus] = useFormState()
  const submit = useCallback(
    async (walletName: string) => {
      try {
        setStatus(FormStatus.Pending)
        logger.debug(`DeleteWallet: ${walletName}`)
        const res = await Service.DeleteWallet(
          new BackendModel.DeleteWalletRequest({ wallet: walletName })
        )
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
        Sentry.captureException(err)
        logger.error(err)
      }
    },
    [dispatch, navigate, setStatus]
  )

  return { status, submit }
}
