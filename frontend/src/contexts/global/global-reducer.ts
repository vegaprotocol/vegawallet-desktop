import type { NetworkPreset } from '../../lib/networks'
import type { Transaction } from '../../lib/transactions'
import { extendKeypair, sortWallet } from '../../lib/wallet-helpers'
import type {
  backend as BackendModel,
  config as ConfigModel
} from '../../wailsjs/go/models'
import type { WalletModel } from '../../wallet-client'
import type { GlobalState, KeyPair, Wallet } from './global-context'
import { AppStatus } from './global-context'

function indexBy<T>(key: keyof T) {
  return (obj: Record<string, T>, value: T) => ({
    ...obj,
    [value[key] as unknown as string]: value
  })
}

export const initialGlobalState: GlobalState = {
  status: AppStatus.Pending,
  version: '',
  wallet: null,
  wallets: [],
  transactionQueue: [],
  transactionHistory: [],
  passphraseModalOpen: false,
  drawerOpen: false,
  settingsModalOpen: false,
  config: null,
  // network
  network: null,
  networks: [],
  presets: [],
  presetsInternal: [],
  networkConfig: null,
  serviceRunning: false,
  serviceUrl: ''
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      isInit: boolean
      config: ConfigModel.Config
      wallets: string[]
      network: string
      networks: string[]
      networkConfig: WalletModel.DescribeNetworkResult | null
      presetNetworks: NetworkPreset[]
      presetNetworksInternal: NetworkPreset[]
      serviceRunning: boolean
    }
  | {
      type: 'INIT_APP_FAILED'
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
      type: 'SET_PASSPHRASE_MODAL'
      open: boolean
    }
  | {
      type: 'SET_DRAWER'
      open: boolean
    }
  | {
      type: 'SET_SETTINGS_MODAL'
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
      type: 'START_SERVICE'
      port: number
    }
  | {
      type: 'STOP_SERVICE'
    }
  | {
      type: 'SET_TRANSACTION_QUEUE'
      payload: Transaction[]
    }
  | {
      type: 'SET_TRANSACTION_HISTORY'
      payload: BackendModel.SentTransaction[]
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
        wallets: action.wallets
          .map(name => ({
            name,
            keypairs: null,
            auth: false
          }))
          .sort(sortWallet),
        network: action.network,
        networks: action.networks,
        networkConfig: action.networkConfig,
        presets: action.presetNetworks,
        presetsInternal: action.presetNetworksInternal,
        status: action.isInit ? AppStatus.Initialised : AppStatus.Failed,
        serviceRunning: action.serviceRunning,
        serviceUrl: action.networkConfig
          ? `http://127.0.0.1:${action.networkConfig.port}`
          : ''
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
        status: AppStatus.Onboarding,
      }
    }
    case 'ADD_WALLET': {
      const keypairExtended: KeyPair = extendKeypair(action.key)
      const newWallet: Wallet = {
        name: action.wallet,
        keypairs: {
          ...(keypairExtended.publicKey && {
            [keypairExtended.publicKey ?? '']: keypairExtended
          })
        },
        auth: true
      }
      return {
        ...state,
        wallet: newWallet,
        wallets: [...state.wallets, newWallet].sort(sortWallet)
      }
    }
    case 'ADD_WALLETS': {
      const newWallets = action.wallets.map(name => ({
        name,
        keypairs: null,
        auth: false
      }))
      return {
        ...state,
        wallets: [...state.wallets, ...newWallets].sort(sortWallet)
      }
    }
    case 'REMOVE_WALLET': {
      return {
        ...state,
        wallet: null,
        wallets: state.wallets
          .filter(w => w.name !== action.wallet)
          .sort(sortWallet)
      }
    }
    case 'SET_KEYPAIRS': {
      const keypairsExtended: KeyPair[] = action.keypairs.map(extendKeypair)
      const currWallet = state.wallets.find(w => w.name === action.wallet)
      const newWallet: Wallet = {
        ...currWallet,
        name: action.wallet,
        keypairs: keypairsExtended.reduce(indexBy('publicKey'), {}),
        auth: true
      }

      return {
        ...state,
        wallet: newWallet,
        wallets: [
          ...state.wallets.filter(w => w.name !== action.wallet),
          newWallet
        ].sort(sortWallet)
      }
    }
    case 'ADD_KEYPAIR':
    case 'UPDATE_KEYPAIR': {
      const wallets = state.wallets.filter(w => w.name !== action.wallet)
      const currWallet = state.wallets.find(w => w.name === action.wallet)

      if (!currWallet) {
        throw new Error('Wallet not found')
      }

      const newKeypair = extendKeypair(action.keypair)
      const updatedWallet: Wallet = {
        ...currWallet,
        keypairs: {
          ...currWallet.keypairs,
          ...(newKeypair.publicKey && {
            [newKeypair.publicKey ?? '']: newKeypair
          })
        }
      }

      return {
        ...state,
        wallet: updatedWallet,
        wallets: [...wallets, updatedWallet].sort(sortWallet)
      }
    }
    case 'ACTIVATE_WALLET': {
      const wallet = state.wallets.find(w => w.name === action.wallet)

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      return {
        ...state,
        wallet: {
          ...wallet,
          auth: true
        },
        wallets: [
          ...state.wallets.filter(w => w.name !== wallet.name),
          {
            ...wallet,
            auth: true
          }
        ].sort(sortWallet)
      }
    }
    case 'DEACTIVATE_WALLET': {
      const wallet = state.wallets.find(w => w.name === action.wallet)

      if (!wallet) {
        return {
          ...state,
          wallet: null
        }
      }

      return {
        ...state,
        wallet: null,
        wallets: [
          ...state.wallets.filter(w => w.name !== wallet.name),
          {
            ...wallet,
            auth: false,
            keypairs: null // remove keypairs so if you deactivate you are required password again
          }
        ].sort(sortWallet)
      }
    }
    case 'CHANGE_WALLET': {
      const wallet = state.wallets.find(w => w.name === action.wallet)

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      return {
        ...state,
        wallet
      }
    }
    case 'SET_PASSPHRASE_MODAL': {
      return {
        ...state,
        passphraseModalOpen: action.open
      }
    }
    case 'SET_DRAWER': {
      return {
        ...state,
        drawerOpen: action.open
      }
    }
    case 'SET_SETTINGS_MODAL': {
      return {
        ...state,
        settingsModalOpen: action.open
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
    case 'START_SERVICE': {
      return {
        ...state,
        serviceRunning: true,
        serviceUrl: `http://127.0.0.1:${action.port}`
      }
    }
    case 'STOP_SERVICE': {
      return {
        ...state,
        serviceRunning: false,
        serviceUrl: ''
      }
    }
    case 'SET_TRANSACTION_QUEUE': {
      return {
        ...state,
        transactionQueue: action.payload
      }
    }
    case 'SET_TRANSACTION_HISTORY': {
      return {
        ...state,
        transactionHistory: action.payload
      }
    }
    default: {
      return state
    }
  }
}
