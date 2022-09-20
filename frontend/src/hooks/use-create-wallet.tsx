import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import type { wallet as WalletModel } from '../wailsjs/go/models'

const logger = createLogger('UseCreateWallet')

export function useCreateWallet() {
  const { actions, service, dispatch } = useGlobal()
  const [response, setResponse] =
    React.useState<WalletModel.CreateWalletResponse | null>(null)

  const submit = React.useCallback(
    async (values: { wallet: string; passphrase: string }) => {
      try {
        logger.debug('CreateWallet')
        const resp = await service.CreateWallet({
          wallet: values.wallet,
          passphrase: values.passphrase
        })

        if (resp) {
          setResponse(resp)

          const keypair = await service.DescribeKey({
            wallet: values.wallet,
            passphrase: values.passphrase,
            pubKey: resp.key.publicKey
          })

          AppToaster.show({
            message: 'Wallet created!',
            intent: Intent.SUCCESS
          })
          dispatch(actions.addWalletAction(values.wallet, keypair))
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
        }
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [dispatch, service, actions]
  )

  return {
    response,
    submit
  }
}
