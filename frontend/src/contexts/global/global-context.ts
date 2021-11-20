import React from 'react'
import { KeyPair } from '../../models/list-keys'
import { GlobalAction } from './global-reducer'

export interface GlobalState {
  init: boolean
  network: string
  networks: string[]
  wallet: string
  wallets: string[]
  keypair: KeyPair | null
  keypairs: KeyPair[]
}

export type GlobalDispatch = React.Dispatch<GlobalAction>

// type GlobalContextShape = [GlobalState, GlobalDispatch]

export const GlobalContext = React.createContext<any | undefined>(undefined)

export function useGlobal() {
  const context = React.useContext(GlobalContext)
  if (context === undefined) {
    throw new Error('useGlobal must be used within GlobalProvider')
  }
  return context
}
