import type { Key } from './keys'

export interface Wallet {
  name: string
  version: number
  filePath: string
  recoveryPhrase: string
}

export interface CreateWalletRequest {
  wallet: string
  passphrase: string
}

export interface CreateWalletResponse {
  wallet: Wallet
  key: Key
}

export interface ImportWalletRequest {
  wallet: string
  passphrase: string
  recoveryPhrase: string
  version: number
}

export interface ImportWalletResponse {
  wallet: Wallet
  key: Key
}

export interface ListWalletsResponse {
  wallets: string[]
}
