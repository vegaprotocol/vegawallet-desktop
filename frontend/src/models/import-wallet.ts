export class ImportWalletRequest {
  VegaHome: string = ''
  Name: string = ''
  Passphrase: string = ''
  Mnemonic: string = ''
}

export class ImportWalletResponse {
  WalletPath: string = ''
}
