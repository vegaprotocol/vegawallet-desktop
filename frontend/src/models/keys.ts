export interface GenerateKeyRequest {
  wallet: string
  metadata: Meta[] | null
  passphrase: string
}

export interface GenerateKeyResponse {
  wallet: Wallet
  key: Key
}

export interface Wallet {
  name: string
  version: number
  filePath: string
  recoveryPhrase: string
}

export interface Key {
  publicKey: string
  meta: Meta[] | null
  algorithm: Algorithm
}

export interface AnnotateKeyRequest {
  wallet: string
  pubKey: string
  metadata: Meta[] | null
  passphrase: string
}

export interface TaintKeyRequest {
  wallet: string
  passphrase: string
  pubKey: string
}

export interface UntaintKeyRequest {
  wallet: string
  passphrase: string
  pubKey: string
}

export interface IsolateKeyRequest {
  wallet: string
  pubKey: string
  passphrase: string
}

export interface IsolateKeyResponse {
  wallet: string
  filePath: string
}

export interface ListKeysRequest {
  wallet: string
  passphrase: string
}

export interface ListKeysResponse {
  keys: NamedKeyPair[] | null
}

export interface NamedKeyPair {
  name: string
  publicKey: string
}

export interface DescribeKeyRequest {
  wallet: string
  passphrase: string
  pubKey: string
}

export interface DescribeKeyResponse {
  publicKey: string
  isTainted: boolean
  meta: Meta[] | null
  algorithm: Algorithm
}

export interface Algorithm {
  version: number
  name: string
}

export interface Meta {
  key: string
  value: string
}
