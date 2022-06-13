import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type { Config, NamedPubKey } from '../../wailsjs/go/models'
import type { GlobalAction } from './global-reducer'

export enum AppStatus {
  Pending,
  Initialised,
  Failed,
  Onboarding
}

export interface KeyPair extends NamedPubKey {
  publicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: KeyPair[] | null
  auth: boolean
}

export interface GlobalState {
  status: AppStatus
  version: string
  wallet: Wallet | null
  wallets: Wallet[]
  passphraseModalOpen: boolean
  drawerOpen: boolean
  onboarding: {
    wallets: string[]
    networks: string[]
  }
  config: Config | null
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
