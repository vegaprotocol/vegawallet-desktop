import type { KeyPair, Wallet } from '../contexts/global/global-context'
import type { Key, NamedKeyPair } from '../models/keys'
import { truncateMiddle } from './truncate-middle'

export function extendKeypair(kp: Key | NamedKeyPair): KeyPair {
  const publicKeyShort = truncateMiddle(kp.publicKey)

  if ('meta' in kp) {
    const nameMeta = kp.meta?.find(m => m.key === 'name')
    return {
      ...kp,
      name: nameMeta ? nameMeta.value : 'No name',
      publicKeyShort
    }
  }

  return {
    ...kp,
    publicKeyShort
  }
}

export function sortWallet(a: Wallet, b: Wallet) {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}
