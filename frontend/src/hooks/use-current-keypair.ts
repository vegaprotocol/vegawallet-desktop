import { useParams } from 'react-router-dom'

import { useCurrentWallet } from './use-current-wallet'

export function useCurrentKeypair() {
  const { wallet } = useCurrentWallet()
  const { pubkey } = useParams<{ pubkey: string }>()
  const keypair = pubkey && wallet ? wallet.keypairs?.[pubkey] : undefined
  return { keypair, wallet }
}
