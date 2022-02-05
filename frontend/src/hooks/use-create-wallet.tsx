import React from 'react'
import { CreateWallet } from '../api/service'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { addWalletAction } from '../contexts/global/global-actions'
import { useGlobal } from '../contexts/global/global-context'
import { CreateWalletResponse } from '../models/wallet'

export function useCreateWallet() {
  const { dispatch } = useGlobal()
  const [response, setResponse] = React.useState<CreateWalletResponse | null>(
    null
  )

  const submit = React.useCallback(
    async (values: { wallet: string; passphrase: string }) => {
      try {
        const resp = await CreateWallet({
          wallet: values.wallet,
          passphrase: values.passphrase
        })
        if (resp) {
          setResponse(resp)
          AppToaster.show({
            message: 'Wallet created!',
            intent: Intent.SUCCESS
          })
          dispatch(addWalletAction(values.wallet, resp.key))
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
        }
      } catch (err) {
        AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      }
    },
    [dispatch]
  )

  return {
    response,
    submit
  }
}