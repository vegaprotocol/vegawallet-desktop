import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobal } from '../contexts/global/global-context'
import { requestPassphrase } from '../components/passphrase-modal'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'

export const useOpenWallet = () => {
  const navigate = useNavigate()
  const { dispatch, actions, service } = useGlobal()

  const open = useCallback(async (wallet: string) => {
    const passphrase = await requestPassphrase()

    try {
      const [_, { keys  = [] }] = await Promise.all([
        service.WalletApi.DescribeWallet({ wallet, passphrase }),
        service.WalletApi.ListKeys({ wallet, passphrase }),
      ])
      dispatch({
        type: 'SET_KEYPAIRS',
        wallet,
        keypairs: keys,
      })
      dispatch({
        type: 'ACTIVATE_WALLET',
        wallet,
      })
      navigate(`/wallet/${encodeURIComponent(wallet)}`)
    } catch (err) {
      AppToaster.show({
        intent: Intent.DANGER,
        message: err instanceof Error ? err.message : ''
      })
    }
  }, [navigate, dispatch, actions])

  return { open }
}
