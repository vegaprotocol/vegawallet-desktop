import omit from 'lodash/omit'

import type { NetworkPreset } from '../../lib/networks'
import type { Transaction } from '../../lib/transactions'
import { extendKeypair } from '../../lib/wallet-helpers'
import { indexBy } from '../../lib/index-by'
import type { config as ConfigModel } from '../../wailsjs/go/models'
import type { WalletModel } from '../../wallet-client'
import type {
  Connection,
  DrawerState,
  GlobalState,
  KeyPair,
  Wallet
} from './global-context'
import { AppStatus, DrawerPanel, ServiceState } from './global-context'

export const initialGlobalState: GlobalState = {
  status: AppStatus.Pending,
  version: '',
  config: null,

  // Wallet
  wallet: null,
  wallets: {},

  // Network
  network: null,
  networks: [],
  presets: [],
  presetsInternal: [],
  networkConfig: null,
  serviceStatus: ServiceState.Stopped,

  // UI
  drawerState: {
    isOpen: false,
    panel: DrawerPanel.Network,
    editingNetwork: null
  },
  isPassphraseModalOpen: false,
  isRemoveWalletModalOpen: false,
  isSignMessageModalOpen: false,
  isTaintKeyModalOpen: false,
  isUpdateKeyModalOpen: false,
  isSettingsModalOpen: false
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      config: ConfigModel.Config
      wallets: string[]
      network: string
      networks: string[]
      networkConfig: WalletModel.DescribeNetworkResult | null
      presetNetworks: NetworkPreset[]
      presetNetworksInternal: NetworkPreset[]
    }
  | {
      type: 'INIT_APP_FAILED'
      message?: string
    }
  | {
      type: 'COMPLETE_ONBOARD'
    }
  | {
      type: 'SET_VERSION'
      version: string
    }
  | {
      type: 'SET_CONFIG'
      config: ConfigModel.Config
    }
  | {
      type: 'START_ONBOARDING'
      existing: {
        wallets: string[]
        networks: string[]
      }
    }
  | {
      type: 'ADD_WALLET'
      wallet: string
      key: WalletModel.DescribeKeyResult
    }
  | {
      type: 'UPDATE_WALLET'
      wallet: string
      data: Wallet
    }
  | {
      type: 'ADD_WALLETS'
      wallets: string[]
    }
  | {
      type: 'REMOVE_WALLET'
      wallet: string
    }
  | {
      type: 'SET_KEYPAIRS'
      wallet: string
      keypairs: WalletModel.DescribeKeyResult[]
    }
  | {
      type: 'UPDATE_KEYPAIR'
      wallet: string
      keypair: WalletModel.DescribeKeyResult
    }
  | {
      type: 'ADD_KEYPAIR'
      wallet: string
      keypair: WalletModel.DescribeKeyResult
    }
  | {
      type: 'SET_CONNECTIONS'
      wallet: string
      connections: Connection[]
    }
  | {
      type: 'SET_PERMISSONS'
      wallet: string
      hostname: string
      permissions: WalletModel.Permissions
    }
  | {
      type: 'CHANGE_WALLET'
      wallet: string
    }
  | {
      type: 'ACTIVATE_WALLET'
      wallet: string
    }
  | {
      type: 'DEACTIVATE_WALLET'
      wallet: string
    }
  | {
      type: 'SET_DRAWER'
      state: DrawerState
    }
  | {
      type: 'SET_PASSPHRASE_MODAL'
      open: boolean
    }
  | {
      type: 'SET_SETTINGS_MODAL'
      open: boolean
    }
  | {
      type: 'SET_REMOVE_WALLET_MODAL'
      open: boolean
    }
  | {
      type: 'SET_TAINT_KEY_MODAL'
      open: boolean
    }
  | {
      type: 'SET_SIGN_MESSAGE_MODAL'
      open: boolean
    }
  | {
      type: 'SET_UPDATE_KEY_MODAL'
      open: boolean
    }
  // Network
  | {
      type: 'SET_NETWORKS'
      network: string | null
      networks: string[]
      config: WalletModel.DescribeNetworkResult | null
    }
  | {
      type: 'SET_PRESETS'
      presets: NetworkPreset[]
    }
  | {
      type: 'SET_PRESETS_INTERNAL'
      presets: NetworkPreset[]
    }
  | {
      type: 'CHANGE_NETWORK'
      network: string
      config: WalletModel.DescribeNetworkResult
    }
  | {
      type: 'UPDATE_NETWORK_CONFIG'
      config: WalletModel.DescribeNetworkResult
    }
  | {
      type: 'ADD_NETWORK'
      network: string
      config: WalletModel.DescribeNetworkResult
    }
  | {
      type: 'ADD_NETWORKS'
      networks: string[]
      network: string
      networkConfig: WalletModel.DescribeNetworkResult
    }
  | {
      type: 'REMOVE_NETWORK'
      network: string
    }
  | {
      type: 'SET_SERVICE_STATUS'
      status: ServiceState
    }
  | {
      type: 'ADD_TRANSACTION'
      transaction: Transaction
    }
  | {
      type: 'UPDATE_TRANSACTION'
      transaction: Transaction
    }
  | {
      type: 'ADD_CONNECTION'
      connection: Connection
      wallet: string
    }

export function globalReducer(
  state: GlobalState,
  action: GlobalAction
): GlobalState {
  switch (action.type) {
    case 'INIT_APP': {
      return {
        ...state,
        config: action.config,
        wallets: action.wallets.reduce(
          (acc, name) => ({
            ...acc,
            [name]: {
              name,
              keypairs: null,
              auth: false
            }
          }),
          {}
        ),
        network: action.network,
        networks: action.networks,
        networkConfig: action.networkConfig,
        presets: action.presetNetworks,
        presetsInternal: action.presetNetworksInternal,
        status: AppStatus.Initialised
      }
    }
    case 'INIT_APP_FAILED': {
      return {
        ...state,
        status: AppStatus.Failed
      }
    }
    case 'COMPLETE_ONBOARD': {
      return {
        ...state,
        status: AppStatus.Initialised
      }
    }
    case 'SET_VERSION': {
      return {
        ...state,
        version: action.version
      }
    }
    case 'SET_CONFIG': {
      return {
        ...state,
        config: action.config
      }
    }
    case 'START_ONBOARDING': {
      return {
        ...state,
        status: AppStatus.Onboarding
      }
    }
    case 'ADD_WALLET': {
      const keypairExtended: KeyPair = extendKeypair(action.key)
      const newWallet: Wallet = {
        name: action.wallet,
        connections: {},
        keypairs: {
          ...(keypairExtended.publicKey && {
            [keypairExtended.publicKey ?? '']: keypairExtended
          })
        },
        auth: false
      }
      return {
        ...state,
        wallet: newWallet.name,
        wallets: {
          ...state.wallets,
          [newWallet.name]: newWallet
        }
      }
    }
    case 'ADD_WALLETS': {
      const newWallets = action.wallets.reduce(
        (acc, name) => ({
          ...acc,
          [name]: {
            name,
            keypairs: null,
            auth: false
          }
        }),
        {}
      )
      return {
        ...state,
        wallets: {
          ...state.wallets,
          ...newWallets
        }
      }
    }
    case 'REMOVE_WALLET': {
      return {
        ...state,
        wallet: null,
        wallets: omit(state.wallets, [action.wallet])
      }
    }
    case 'SET_KEYPAIRS': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }

      const keypairsExtended: KeyPair[] = action.keypairs.map(extendKeypair)
      const newWallet: Wallet = {
        ...state.wallets[action.wallet],
        name: action.wallet,
        keypairs: keypairsExtended.reduce(indexBy('publicKey'), {}),
        auth: true
      }

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet]: newWallet
        }
      }
    }
    case 'ADD_KEYPAIR':
    case 'UPDATE_KEYPAIR': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }
      const currentWallet = state.wallets[action.wallet]

      const newKeypair = extendKeypair(action.keypair)
      const updatedWallet: Wallet = {
        ...currentWallet,
        keypairs: {
          ...currentWallet.keypairs,
          ...(newKeypair.publicKey && {
            [newKeypair.publicKey ?? '']: newKeypair
          })
        }
      }

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet]: updatedWallet
        }
      }
    }
    case 'SET_CONNECTIONS': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }
      const targetWallet = state.wallets[action.wallet]

      const updatedWallet: Wallet = {
        ...targetWallet,
        connections: action.connections.reduce(indexBy<Connection>('hostname'), {}),
      }

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet]: updatedWallet
        }
      }
    }
    case 'SET_PERMISSONS': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }
      const targetWallet = state.wallets[action.wallet]

      if (!targetWallet.connections?.[action.hostname]) {
        throw new Error('Connection not found')
      }

      const targetConnection = targetWallet.connections[action.hostname]

      const updatedWallet: Wallet = {
        ...targetWallet,
        connections: {
          ...targetWallet.connections,
          [action.hostname]: {
            ...targetConnection,
            permissions: action.permissions,
          }
        }
      }

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.wallet]: updatedWallet
        }
      }
    }
    case 'ACTIVATE_WALLET': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }

      return {
        ...state,
        wallet: action.wallet,
        wallets: {
          ...state.wallets,
          [action.wallet]: {
            ...state.wallets[action.wallet],
            auth: true
          }
        }
      }
    }
    case 'DEACTIVATE_WALLET': {
      return {
        ...state,
        wallet: null
      }
    }
    case 'CHANGE_WALLET': {
      if (!state.wallets[action.wallet]) {
        throw new Error('Wallet not found')
      }

      return {
        ...state,
        wallet: action.wallet
      }
    }
    case 'SET_DRAWER': {
      return {
        ...state,
        drawerState: action.state
      }
    }
    case 'SET_PASSPHRASE_MODAL': {
      return {
        ...state,
        isPassphraseModalOpen: action.open
      }
    }
    case 'SET_SETTINGS_MODAL': {
      return {
        ...state,
        isSettingsModalOpen: action.open
      }
    }
    case 'SET_TAINT_KEY_MODAL': {
      return {
        ...state,
        isTaintKeyModalOpen: action.open
      }
    }
    case 'SET_SIGN_MESSAGE_MODAL': {
      return {
        ...state,
        isSignMessageModalOpen: action.open
      }
    }
    case 'SET_UPDATE_KEY_MODAL': {
      return {
        ...state,
        isUpdateKeyModalOpen: action.open
      }
    }
    case 'SET_REMOVE_WALLET_MODAL': {
      return {
        ...state,
        isRemoveWalletModalOpen: action.open
      }
    }
    // network
    case 'SET_NETWORKS': {
      return {
        ...state,
        network: action.network,
        networks: action.networks.sort(),
        networkConfig: action.config
      }
    }
    case 'SET_PRESETS': {
      return {
        ...state,
        presets: action.presets
      }
    }
    case 'SET_PRESETS_INTERNAL': {
      return {
        ...state,
        presetsInternal: action.presets
      }
    }
    case 'CHANGE_NETWORK': {
      return {
        ...state,
        network: action.network,
        networkConfig: action.config
      }
    }
    case 'UPDATE_NETWORK_CONFIG': {
      return {
        ...state,
        networkConfig: action.config
      }
    }
    case 'ADD_NETWORK': {
      const networks = [
        ...state.networks.filter(n => n !== action.network),
        action.network
      ].sort()
      const changeToNewNetwork =
        state.networks === null || state.networks.length === 0
      const network = changeToNewNetwork ? action.network : state.network
      const config = changeToNewNetwork ? action.config : state.networkConfig
      return {
        ...state,
        network,
        networks,
        networkConfig: config
      }
    }
    case 'ADD_NETWORKS': {
      const newNetworks = action.networks.filter(
        n => state.networks.indexOf(n) < 0
      )
      return {
        ...state,
        networks: [...state.networks, ...newNetworks],
        network: action.network,
        networkConfig: action.networkConfig
      }
    }
    case 'REMOVE_NETWORK': {
      return {
        ...state,
        network: null,
        networks: state.networks.filter(n => n !== action.network),
        networkConfig: null
      }
    }
    case 'SET_SERVICE_STATUS': {
      return {
        ...state,
        serviceStatus: action.status
      }
    }
    case 'ADD_TRANSACTION':
    case 'UPDATE_TRANSACTION': {
      const targetWallet = state.wallets[action.transaction.wallet]

      if (!targetWallet) {
        throw new Error('Wallet not found')
      }

      const keypair = targetWallet.keypairs?.[action.transaction.publicKey]

      if (!keypair) {
        throw new Error('Public key not found')
      }

      const updatedWallet: Wallet = {
        ...targetWallet,
        keypairs: {
          ...targetWallet.keypairs,
          [action.transaction.publicKey]: {
            ...keypair,
            transactions: {
              ...keypair.transactions,
              [action.transaction.id]: action.transaction
            }
          }
        }
      }

      return {
        ...state,
        wallets: {
          ...state.wallets,
          [action.transaction.wallet]: updatedWallet
        }
      }
    }
    case 'ADD_CONNECTION': {
      const targetWallet = state.wallets[action.wallet]

      if (!targetWallet) {
        throw new Error('Wallet not found')
      }

      const updatedWallet: Wallet = {
        ...targetWallet,
        connections: {
          ...targetWallet.connections,
          [action.connection.hostname]: action.connection
        }
      }

      return {
        ...state,
        wallets: {
          [action.wallet]: updatedWallet
        }
      }
    }
    default: {
      return state
    }
  }
}
