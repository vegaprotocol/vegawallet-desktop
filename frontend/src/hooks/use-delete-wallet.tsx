import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
import { FormStatus, useFormState } from '../hooks/use-form-state'
import { createLogger } from '../lib/logging'
import { Paths } from '../routes'

const logger = createLogger('Delete')

export const useDeleteWallet = () => {
  const navigate = useNavigate()
  const { dispatch, service } = useGlobal()
  const [status, setStatus] = useFormState()
  const submit = useCallback(
    async (walletName: string) => {
      try {
        setStatus(FormStatus.Pending)
        logger.debug(`DeleteWallet: ${walletName}`)
        await service.WalletApi.RemoveWallet({ wallet: walletName })
        AppToaster.show({ message: 'Wallet deleted', intent: Intent.SUCCESS })
        setStatus(FormStatus.Success)
        dispatch({ type: 'REMOVE_WALLET', wallet: walletName })
        navigate(Paths.Home)
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
