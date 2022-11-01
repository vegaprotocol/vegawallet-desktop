import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { AppStatus, useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import type { WalletModel } from '../wallet-client'
import { useVegaHome } from './use-vega-home'

const logger = createLogger('UseImportWallet')

export function useImportWallet() {
  const vegaHome = useVegaHome()
  const { actions, service, dispatch, state } = useGlobal()
  const [response, setResponse] =
    React.useState<WalletModel.ImportWalletResult | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  const submit = React.useCallback(
    async (values: {
      wallet: string
      passphrase: string
      recoveryPhrase: string
      version: number
    }) => {
      logger.debug('ImportWallet')
      try {
        if (state.status !== AppStatus.Initialised) {
          await service.InitialiseApp({ vegaHome })
        }

        const resp = await service.WalletApi.ImportWallet({
          wallet: values.wallet,
          passphrase: values.passphrase,
          recoveryPhrase: values.recoveryPhrase,
          version: Number(values.version)
        })

        if (resp && resp.key && resp.wallet) {
          setResponse(resp)

          const keypair = await service.WalletApi.DescribeKey({
            wallet: values.wallet,
            passphrase: values.passphrase,
            publicKey: resp.key.publicKey
          })

          dispatch(actions.addWalletAction(values.wallet, keypair))
          AppToaster.show({
            message: `Wallet imported to: ${resp.wallet.filePath}`,
            intent: Intent.SUCCESS,
            timeout: 0
          })
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
          setError(new Error('Something went wrong'))
        }
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        setError(err as Error)
        logger.error(err)
      }
    },
    [dispatch, actions, service, state.status, vegaHome]
  )

  return {
    response,
    submit,
    error
  }
}
