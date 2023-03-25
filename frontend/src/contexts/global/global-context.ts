import React from 'react'
import type {Thunk} from 'react-hook-thunk-reducer'

import {config, network, wallet} from '../../wailsjs/go/models'
import type {GlobalAction} from './global-reducer'

export enum AppStatus {
  Pending = 'Pending',
  Initialised = 'Initialised',
  Failed = 'Failed',
  Onboarding = 'Onboarding'
}

export interface KeyPair extends wallet.NamedPubKey {
  publicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: KeyPair[] | null
  auth: boolean
}

export enum ProxyName {
  Console = 'Console',
  TokenDApp = 'TokenDApp'
}

export interface ProxyApp {
  name: ProxyName
  running: boolean
  url: string
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
  }
  config: config.Config | null
  // Network
  network: string | null
  networks: string[]
  networkConfig: network.Network | null
  serviceRunning: boolean
  serviceUrl: string
  console: ProxyApp
  tokenDapp: ProxyApp
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
