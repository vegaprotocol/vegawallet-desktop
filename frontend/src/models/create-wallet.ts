export class CreateWalletRequest {
  VegaHome: string = ''
  Name: string = ''
  Passphrase: string = ''
}

export class CreateWalletResponse {
  WalletPath: string = ''
  Mnemonic: string = ''
}
