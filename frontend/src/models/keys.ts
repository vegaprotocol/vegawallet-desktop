export class GenerateKeyRequest {
  Wallet: string = ''
  Metadata: Meta[] | null = []
  Passphrase: string = ''
}

export class GenerateKeyResponse {
  Wallet: Wallet = new Wallet()
  Key: Key = new Key()
}

export class Wallet {
  Name: string = ''
  Version: number = 0
  FilePath: string = ''
  Mnemonic: string = ''
}

export class Key {
  PublicKey: string = ''
  IsTainted: boolean = false
  Meta: Meta[] | null = []
  Algorithm: Algorithm = new Algorithm()
}

export class AnnotateKeyRequest {
  Wallet: string = ''
  PubKey: string = ''
  Metadata: Meta[] | null = []
  Passphrase: string = ''
}

export class TaintKeyRequest {
  Wallet: string = ''
  Passphrase: string = ''
  PubKey: string = ''
}

export class UntaintKeyRequest {
  Wallet: string = ''
  Passphrase: string = ''
  PubKey: string = ''
}

export class IsolateKeyRequest {
  Wallet: string = ''
  PubKey: string = ''
  Passphrase: string = ''
}

export class IsolateKeyResponse {
  Wallet: string = ''
  FilePath: string = ''
}

export class ListKeysRequest {
  Wallet: string = ''
  Passphrase: string = ''
}

export class ListKeysResponse {
  keys: NamedKeyPair[] | null = []
}

export class NamedKeyPair {
  name: string = ''
  publicKey: string = ''
}

export class DescribeKeyRequest {
  Wallet: string = ''
  Passphrase: string = ''
  PubKey: string = ''
}

export class DescribeKeyResponse {
  PublicKey: string = ''
  IsTainted: boolean = false
  Meta: Meta[] | null = []
  Algorithm: Algorithm = new Algorithm()
}

export class Algorithm {
  Version: number = 0
  Name: string = ''
}

export class Meta {
  Key: string = ''
  Value: string = ''
}
