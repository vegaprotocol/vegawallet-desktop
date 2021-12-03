export interface ImportWalletRequest {
  Name: string
  Passphrase: string
  Mnemonic: string
  Version: number
}

export interface ImportWalletResponse {
  WalletPath: string
}
