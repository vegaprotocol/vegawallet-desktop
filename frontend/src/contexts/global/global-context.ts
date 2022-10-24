import type log from 'loglevel'
import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type { NetworkPreset } from '../../lib/networks'
import type { ServiceType } from '../../service'
import type { config as ConfigModel } from '../../wailsjs/go/models'
import type { WalletModel } from '../../wallet-client'
import type { GlobalActions } from './global-actions'
import type { GlobalAction } from './global-reducer'
import type { Transaction } from '../../lib/transactions'

export enum AppStatus {
  Pending = 'Pending',
  Initialised = 'Initialised',
  Failed = 'Failed',
  Onboarding = 'Onboarding'
}

export enum ServiceState {
  Started = 'Started',
  Stopped = 'Stopped',
  Loading = 'Loading',
  Unhealthy = 'Unhealthy',
  Unreachable = 'Unreachable',
  Error = 'Error'
}

export enum DrawerPanel {
  Network,
  Manage,
  Edit,
  Add
}

export type DrawerState = {
  isOpen: boolean
  panel: DrawerPanel | null
  editingNetwork: string | null
}

export interface KeyPair
  extends Pick<WalletModel.DescribeKeyResult, 'publicKey' | 'isTainted'> {
  name: string
  publicKeyShort: string
  meta: WalletModel.DescribeKeyResult['metadata']
  transactions: Transaction[]
}

export interface Wallet {
  name: string
  keypairs: null | Record<string, KeyPair>
  auth: boolean
}

export interface GlobalState {
  status: AppStatus
  version: string
  config: ConfigModel.Config | null

  // Wallet
  wallet: string | null
  wallets: Record<string, Wallet>

  // Network
  network: string | null
  networks: string[]
  presets: NetworkPreset[]
  presetsInternal: NetworkPreset[]
  networkConfig: WalletModel.DescribeNetworkResult | null
  serviceStatus: ServiceState

  // UI
  drawerState: DrawerState
  isPassphraseModalOpen: boolean
  isRemoveWalletModalOpen: boolean
  isSignMessageModalOpen: boolean
  isTaintKeyModalOpen: boolean
  isUpdateKeyModalOpen: boolean
  isSettingsModalOpen: boolean
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
