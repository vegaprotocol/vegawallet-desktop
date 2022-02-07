export interface SignMessageResponse {
  hexSignature: string
  binarySignature: string
}

export interface SignMessageRequest {
  wallet: string
  pubKey: string
  message: string
  passphrase: string
}
