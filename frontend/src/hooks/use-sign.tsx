import React, { useState } from 'react'

import { requestPassphrase } from '../components/passphrase-modal'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'
import { createLogger } from '../lib/logging'

const logger = createLogger('Sign')

export const useSign = (pubKey?: string, wallet?: string) => {
  const { service } = useGlobal()
  const [signedData, setSignedData] = useState<string>('')
  const sign = React.useCallback(
    async (values: { message: string }) => {
      try {
        if (!pubKey || !wallet) {
          return
        }

        const passphrase = await requestPassphrase()
        const resp = await service.WalletApi.SignMessage({
          wallet,
          passphrase,
          pubKey,
          // @ts-ignore
          encodedMessage: btoa(values.message)
        })
        // @ts-ignore
        setSignedData(resp.encodedSignature)
        AppToaster.show({
          message: `Message signed successfully`,
          intent: Intent.SUCCESS
        })
      } catch (err) {
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    },
    [service, pubKey, wallet]
  )
  return {
    signedData,
    setSignedData,
    sign
  }
}
