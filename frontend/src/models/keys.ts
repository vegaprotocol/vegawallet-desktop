import type { Meta } from '../wailsjs/go/models'

export interface Key {
  publicKey: string
  meta: Meta[] | null
  algorithm: Algorithm
}

export interface NamedKeyPair {
  name: string
  publicKey: string
}
