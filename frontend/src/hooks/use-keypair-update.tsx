import { useCallback, useState } from 'react'

import { requestPassphrase } from '../components/passphrase-modal'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import type { GlobalActions } from '../contexts/global/global-actions'
import type { GlobalDispatch } from '../contexts/global/global-context'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'

const logger = createLogger('Metadata')

export type Meta = {
  key: string
  value: string
}

export const useKeypairUpdate = (
  dispatch: GlobalDispatch,
  actions: GlobalActions,
  pubKey?: string,
  wallet?: string
) => {
  const { service } = useGlobal()
  const [loading, setLoading] = useState(false)

  const update = useCallback(
    async (metadata: Meta[]) => {
      setLoading(true)
      try {
        if (!pubKey || !wallet) {
          return
        }

        const passphrase = await requestPassphrase()
        await service.WalletApi.AnnotateKey({
          wallet,
          passphrase,
          publicKey: pubKey,
          metadata
        })

        const keypair = await service.WalletApi.DescribeKey({
          wallet,
          passphrase,
          publicKey: pubKey
        })

        dispatch(actions.updateKeyPairAction(wallet, keypair))
        dispatch({ type: 'SET_UPDATE_KEY_MODAL', open: false })

        AppToaster.show({
          message: `Successfully updated metadata`,
          intent: Intent.SUCCESS
        })
        setLoading(false)
      } catch (err) {
        setLoading(false)
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [dispatch, actions, pubKey, service, wallet]
  )

  return {
    loading,
    update
  }
}
