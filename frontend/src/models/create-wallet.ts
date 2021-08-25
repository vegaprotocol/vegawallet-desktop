export class CreateWalletRequest {
  RootPath: string = ''
  Name: string = ''
  Passphrase: string = ''
}

export class CreateWalletResponse {
  Mnemonic: string = ''
}
