import React from 'react'
import { Thunk } from 'react-hook-thunk-reducer'
import { NamedKeyPair } from '../../models/keys'
import { GlobalAction } from './global-reducer'

export enum AppStatus {
  Pending,
  Initialised,
  Failed
}

export interface KeyPair extends NamedKeyPair {
  publicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: KeyPair[] | null
  keypair: KeyPair | null
}

export interface GlobalState {
  status: AppStatus
  version: string
  wallets: Wallet[]
  wallet: Wallet | null
  passphraseModalOpen: boolean
  drawerOpen: boolean
}

export type GlobalDispatch = React.Dispatch<
  GlobalAction | Thunk<GlobalState, GlobalAction>
>

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
