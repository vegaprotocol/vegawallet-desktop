import { useParams } from 'react-router-dom'

import { useGlobal } from '../contexts/global/global-context'

export function useCurrentKeypair() {
  const { pubkey } = useParams<{ pubkey: string }>()
  const {
    state: { wallet }
  } = useGlobal()
  const keypair = wallet?.keypairs?.find(kp => kp.publicKey === pubkey)
  return { keypair, wallet }
}
