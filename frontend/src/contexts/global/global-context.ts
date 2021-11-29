import React from 'react'
import { KeyPair } from '../../models/list-keys'
import { GlobalAction } from './global-reducer'

export interface KeyPairExtended extends KeyPair {
  Name: string
  PublicKeyShort: string
}

export interface GlobalState {
  init: boolean
  network: string
  networks: string[]
  wallet: string
  wallets: string[]
  keypair: KeyPairExtended | null
  keypairs: KeyPairExtended[] | null
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
