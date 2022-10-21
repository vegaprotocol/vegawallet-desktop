import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { requestPassphrase } from '../components/passphrase-modal'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { useGlobal } from '../contexts/global/global-context'

export const useOpenWallet = () => {
  const navigate = useNavigate()
  const { dispatch, service } = useGlobal()

  const open = useCallback(
    async (wallet: string) => {
      const passphrase = await requestPassphrase()

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_w, { keys = [] }] = await Promise.all([
          service.WalletApi.DescribeWallet({ wallet, passphrase }),
          service.WalletApi.ListKeys({ wallet, passphrase })
        ])

        const keysWithMeta = await Promise.all(
          keys.map(key =>
            service.WalletApi.DescribeKey({
              wallet,
              passphrase,
              publicKey: key.publicKey ?? ''
            })
          )
        )

        dispatch({
          type: 'SET_KEYPAIRS',
          wallet,
          keypairs: keysWithMeta || []
        })
        dispatch({
          type: 'ACTIVATE_WALLET',
          wallet
        })
        navigate(`/wallet/${encodeURIComponent(wallet)}`)
      } catch (err) {
        AppToaster.show({
          intent: Intent.DANGER,
          message: `${err}`
        })
      }
    },
    [navigate, service, dispatch]
  )

  return { open }
}
