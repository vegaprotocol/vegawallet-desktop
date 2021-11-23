export class ImportWalletRequest {
  VegaHome: string = ''
  Name: string = ''
  Passphrase: string = ''
  Mnemonic: string = ''
  Version: number = 2
}

export class ImportWalletResponse {
  WalletPath: string = ''
}
