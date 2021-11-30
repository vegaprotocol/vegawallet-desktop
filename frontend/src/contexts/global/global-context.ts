import React from 'react'
import { KeyPair } from '../../models/list-keys'
import { GlobalAction } from './global-reducer'

export enum AppStatus {
  Pending,
  Initialised,
  Failed
}

export interface KeyPairExtended extends KeyPair {
  Name: string
  PublicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: KeyPairExtended[] | null
  keypair: KeyPairExtended | null
}

export interface GlobalState {
  status: AppStatus
  network: string
  networks: string[]
  wallets: Wallet[]
  wallet: Wallet | null
}

export type GlobalDispatch = React.Dispatch<GlobalAction>

type GlobalContextShape = { state: GlobalState; dispatch: GlobalDispatch }

export const GlobalContext = React.createContext<
  GlobalContextShape | undefined
>(undefined)

export function useGlobal() {
  const context = React.useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within GlobalProvider')
  }
  return context
}
