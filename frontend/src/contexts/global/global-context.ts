import type log from 'loglevel'
import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type { ServiceType } from '../../service'
import type {
  config as ConfigModel,
  network as NetworkModel
} from '../../wailsjs/go/models'
import type { WalletModel } from '../../wallet-client'
import type { GlobalActions } from './global-actions'
import type { GlobalAction } from './global-reducer'

export enum AppStatus {
  Pending = 'Pending',
  Initialised = 'Initialised',
  Failed = 'Failed',
  Onboarding = 'Onboarding'
}

export interface KeyPair
  extends Pick<
    WalletModel.DescribeKeyResponse,
    'publicKey' | 'meta' | 'isTainted'
  > {
  name: string
  publicKeyShort: string
}

export interface Wallet {
  name: string
  keypairs: null | Record<string, KeyPair>
  auth: boolean
}

export interface NetworkPreset {
  name: string
  configFileUrl: string
  sha: string
}

export interface GlobalState {
  status: AppStatus
  version: string
  config: ConfigModel.Config | null
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
  networkConfig: NetworkModel.Network | null
  serviceRunning: boolean
  serviceUrl: string

  // UI
  sidebarOpen: boolean
  passphraseModalOpen: boolean
  drawerOpen: boolean
  settingsModalOpen: boolean
}

export type GlobalDispatch = React.Dispatch<
  GlobalAction | Thunk<GlobalState, GlobalAction>
>

type GlobalContextShape = {
  state: GlobalState
  logger: log.Logger
  actions: GlobalActions
  dispatch: GlobalDispatch
  service: ServiceType
}

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
