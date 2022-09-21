import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import type { WalletModel } from '../wallet-client'

const logger = createLogger('UseImportWallet')

export function useImportWallet() {
  const { actions, service, dispatch } = useGlobal()
  const [response, setResponse] =
    React.useState<WalletModel.ImportWalletResponse | null>(null)
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
        const resp = await service.WalletApi.ImportWallet(
          values.wallet,
          values.passphrase,
          values.recoveryPhrase,
          Number(values.version),
        )

        if (resp) {
          setResponse(resp)

          const keypair = await service.WalletApi.DescribeKey(
            values.wallet,
            values.passphrase,
            resp.key.publicKey
          )

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
    [dispatch, service, actions]
  )

  return {
    response,
    submit,
    error
  }
}
