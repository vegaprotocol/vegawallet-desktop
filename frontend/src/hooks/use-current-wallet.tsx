import { useParams } from 'react-router-dom'

import { useGlobal } from '../contexts/global/global-context'

export function useCurrentWallet() {
  const { wallet = '' } = useParams<{ wallet: string }>()
  const walletParam = decodeURIComponent(wallet)

  const {
    state: { wallet: currentWallet }
  } = useGlobal()

  return {
    wallet: currentWallet?.name === walletParam ? currentWallet : undefined
  }
}
