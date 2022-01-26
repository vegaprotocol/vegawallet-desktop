export interface CreateWalletRequest {
  Name: string
  Passphrase: string
}

export interface CreateWalletResponse {
  WalletPath: string
  WalletVersion: number
  RecoveryPhrase: string
}
