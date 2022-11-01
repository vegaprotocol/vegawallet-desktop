import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { AppStatus, useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import type { WalletModel } from '../wallet-client'
import { useVegaHome } from './use-vega-home'

const logger = createLogger('UseCreateWallet')

export function useCreateWallet() {
  const vegaHome = useVegaHome()
  const { actions, service, dispatch, state } = useGlobal()
  const [response, setResponse] =
    React.useState<WalletModel.CreateWalletResult | null>(null)

  const submit = React.useCallback(
    async (values: { wallet: string; passphrase: string }) => {
      try {
        logger.debug('CreateWallet')
        if (state.status !== AppStatus.Initialised) {
          await service.InitialiseApp({ vegaHome })
        }

        const resp = await service.WalletApi.CreateWallet({
          wallet: values.wallet,
          passphrase: values.passphrase
        })

        if (resp) {
          setResponse(resp)

          const keypair = await service.WalletApi.DescribeKey({
            wallet: values.wallet,
            passphrase: values.passphrase,
            publicKey: resp.key.publicKey
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
    [dispatch, actions, service, state.status, vegaHome]
  )

  return {
    response,
    submit
  }
}
