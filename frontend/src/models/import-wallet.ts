export interface ImportWalletRequest {
  VegaHome: string
  Name: string
  Passphrase: string
  Mnemonic: string
  Version: number
}

export interface ImportWalletResponse {
  WalletPath: string
}
