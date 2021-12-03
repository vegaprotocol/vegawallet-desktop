export interface CreateWalletRequest {
  Name: string
  Passphrase: string
}

export interface CreateWalletResponse {
  WalletPath: string
  Mnemonic: string
}
