export interface ImportWalletRequest {
  Name: string
  Passphrase: string
  RecoveryPhrase: string
  Version: number
}

export interface ImportWalletResponse {
  WalletPath: string
}
