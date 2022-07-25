import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { addWalletAction } from '../contexts/global/global-actions'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'
import * as Service from '../wailsjs/go/backend/Handler'
import type { wallet as WalletModel } from '../wailsjs/go/models'

const logger = createLogger('UseCreateWallet')

export function useCreateWallet() {
  const { dispatch } = useGlobal()
  const [response, setResponse] =
    React.useState<WalletModel.CreateWalletResponse | null>(null)

  const submit = React.useCallback(
    async (values: { wallet: string; passphrase: string }) => {
      try {
        logger.debug('CreateWallet')
        const resp = await Service.CreateWallet({
          wallet: values.wallet,
          passphrase: values.passphrase
        })

        if (resp instanceof Error) {
          throw new Error('CreateWallet failed')
        }

        if (resp) {
          setResponse(resp)

          const keypair = await Service.DescribeKey({
            wallet: values.wallet,
            passphrase: values.passphrase,
            pubKey: resp.key.publicKey
          })

          if (keypair instanceof Error) {
            throw new Error('DescribeKey failed')
          }

          AppToaster.show({
            message: 'Wallet created!',
            intent: Intent.SUCCESS
          })
          dispatch(addWalletAction(values.wallet, keypair))
        } else {
          AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
        }
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [dispatch]
  )

  return {
    response,
    submit
  }
}
