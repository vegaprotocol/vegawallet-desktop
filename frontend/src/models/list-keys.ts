export class ListKeysRequest {
  Name: string = ''
  Passphrase: string = ''
}

export class ListKeysResponse {
  Name: string = ''
  KeyPairs: KeyPair[] | null = []
}

export class KeyPair {
  PublicKey: string = ''
  PrivateKey: string = ''
  IsTainted: boolean = false
  Meta: Meta[] = []
  AlgorithmVersion: number = 0
  AlgorithmName: string = ''
}

export class Meta {
  Key: string = ''
  Value: string = ''
}
