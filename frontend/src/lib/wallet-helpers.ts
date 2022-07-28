import type { KeyPair, Wallet } from '../contexts/global/global-context'
import type { wallet as WalletModel } from '../wailsjs/go/models'
import { truncateMiddle } from './truncate-middle'

export function extendKeypair(kp: WalletModel.DescribeKeyResponse): KeyPair {
  const publicKeyShort = truncateMiddle(kp.publicKey)
  const nameMeta = kp.meta.find(m => m.key === 'name')
  return {
    isTainted: kp.isTainted,
    publicKey: kp.publicKey,
    meta: kp.meta,
    name: nameMeta ? nameMeta.value : 'No name',
    publicKeyShort
  }
}

export function sortWallet(a: Wallet, b: Wallet) {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}
