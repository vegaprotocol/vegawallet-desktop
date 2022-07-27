import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type {
  Config,
  DescribeKeyResponse,
  Network
} from '../../wailsjs/go/models'
import type { GlobalAction } from './global-reducer'

export enum AppStatus {
  Pending = 'Pending',
  Initialised = 'Initialised',
  Failed = 'Failed',
  Onboarding = 'Onboarding'
}

export interface KeyPair
  extends Pick<DescribeKeyResponse, 'publicKey' | 'meta' | 'isTainted'> {
  name: string
  publicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: null | Record<string, KeyPair>
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

export interface NetworkPreset {
  name: string
  configFileUrl: string
  sha: string
}

export interface GlobalState {
  status: AppStatus
  version: string
  config: Config
  onboarding: {
    wallets: string[]
    networks: string[]
  }

  // Wallet
  wallet: Wallet | null
  wallets: Wallet[]

  // Network
  network: string | null
  networks: string[]
  presets: NetworkPreset[]
  networkConfig: Network | null
  serviceRunning: boolean
  serviceUrl: string
  console: ProxyApp
  tokenDapp: ProxyApp

  // UI
  sidebarOpen: boolean
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
