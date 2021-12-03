export interface CreateWalletRequest {
  VegaHome: string
  Name: string
  Passphrase: string
}

export interface CreateWalletResponse {
  WalletPath: string
  Mnemonic: string
}
