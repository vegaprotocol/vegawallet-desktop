export class GenerateKeyRequest {
  wallet: string = ''
  metadata: Meta[] | null = []
  passphrase: string = ''
}

export class GenerateKeyResponse {
  wallet: Wallet = new Wallet()
  key: Key = new Key()
}

export class Wallet {
  name: string = ''
  version: number = 0
  filePath: string = ''
  mnemonic: string = ''
}

export class Key {
  publicKey: string = ''
  meta: Meta[] | null = []
  algorithm: Algorithm = new Algorithm()
}

export class AnnotateKeyRequest {
  wallet: string = ''
  pubKey: string = ''
  metadata: Meta[] | null = []
  passphrase: string = ''
}

export class TaintKeyRequest {
  wallet: string = ''
  passphrase: string = ''
  pubKey: string = ''
}

export class UntaintKeyRequest {
  wallet: string = ''
  passphrase: string = ''
  pubKey: string = ''
}

export class IsolateKeyRequest {
  wallet: string = ''
  pubKey: string = ''
  passphrase: string = ''
}

export class IsolateKeyResponse {
  wallet: string = ''
  filePath: string = ''
}

export class ListKeysRequest {
  wallet: string = ''
  passphrase: string = ''
}

export class ListKeysResponse {
  keys: NamedKeyPair[] | null = []
}

export class NamedKeyPair {
  name: string = ''
  publicKey: string = ''
}

export class DescribeKeyRequest {
  wallet: string = ''
  passphrase: string = ''
  pubKey: string = ''
}

export class DescribeKeyResponse {
  publicKey: string = ''
  isTainted: boolean = false
  meta: Meta[] | null = []
  algorithm: Algorithm = new Algorithm()
}

export class Algorithm {
  version: number = 0
  name: string = ''
}

export class Meta {
  key: string = ''
  value: string = ''
}
