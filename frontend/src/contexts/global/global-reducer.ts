import { extendKeypair, sortWallet } from '../../lib/wallet-helpers'
import type {
  Config,
  FirstPublicKey,
  NamedPubKey,
  Network
} from '../../wailsjs/go/models'
import type {
  GlobalState,
  KeyPair,
  NetworkPreset,
  ProxyApp,
  Wallet
} from './global-context'
import { ProxyName } from './global-context'
import { AppStatus } from './global-context'

export const initialGlobalState: GlobalState = {
  status: AppStatus.Pending,
  version: '',
  wallet: null,
  wallets: [],
  passphraseModalOpen: false,
  drawerOpen: false,
  onboarding: {
    wallets: [],
    networks: []
  },
  config: null,
  // network
  network: null,
  networks: [],
  presets: [],
  networkConfig: null,
  serviceRunning: false,
  serviceUrl: '',
  console: {
    name: ProxyName.Console,
    running: false,
    url: ''
  },
  tokenDapp: {
    name: ProxyName.TokenDApp,
    running: false,
    url: ''
  }
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      isInit: boolean
      config: Config
      wallets: string[]
      network: string
      networks: string[]
      networkConfig: Network | null
      presetNetworks: NetworkPreset[]
      startService: boolean
      console: ProxyApp
      tokenDapp: ProxyApp
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
      config: Config
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
      key: FirstPublicKey
    }
  | {
      type: 'ADD_WALLETS'
      wallets: string[]
    }
  | {
      type: 'SET_KEYPAIRS'
      wallet: string
      keypairs: NamedPubKey[]
    }
  | {
      type: 'ADD_KEYPAIR'
      wallet: string
      keypair: FirstPublicKey
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
  // Network
  | {
      type: 'SET_NETWORKS'
      network: string | null
      networks: string[]
      config: Network | null
    }
  | {
      type: 'SET_PRESETS'
      presets: NetworkPreset[]
    }
  | {
      type: 'CHANGE_NETWORK'
      network: string
      config: Network
    }
  | {
      type: 'UPDATE_NETWORK_CONFIG'
      config: Network
    }
  | {
      type: 'ADD_NETWORK'
      network: string
      config: Network
    }
  | {
      type: 'ADD_NETWORKS'
      networks: string[]
      network: string
      networkConfig: Network
    }
  | {
      type: 'START_SERVICE'
      port: number
    }
  | {
      type: 'STOP_SERVICE'
    }
  | {
      type: 'START_PROXY'
      app: ProxyName
      url: string
    }
  | {
      type: 'STOP_PROXY'
      app: ProxyName
    }
  | {
      type: 'STOP_ALL_PROXIES'
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
        status: action.isInit ? AppStatus.Initialised : AppStatus.Failed,
        serviceRunning: action.startService,
        serviceUrl: action.networkConfig
          ? `http://127.0.0.1:${action.networkConfig.port}`
          : '',
        console: action.console,
        tokenDapp: action.tokenDapp
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
        onboarding: action.existing
      }
    }
    case 'ADD_WALLET': {
      const keypairExtended: KeyPair = extendKeypair(action.key)
      const newWallet: Wallet = {
        name: action.wallet,
        keypairs: [keypairExtended],
        auth: false
      }
      return {
        ...state,
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
    case 'SET_KEYPAIRS': {
      const keypairsExtended: KeyPair[] = action.keypairs.map(extendKeypair)
      const currWallet = state.wallets.find(w => w.name === action.wallet)
      const newWallet: Wallet = {
        ...currWallet,
        name: action.wallet,
        keypairs: keypairsExtended,
        auth: true
      }

      return {
        ...state,
        wallets: [
          ...state.wallets.filter(w => w.name !== action.wallet),
          newWallet
        ].sort(sortWallet)
      }
    }
    case 'ADD_KEYPAIR': {
      const wallets = state.wallets.filter(w => w.name !== action.wallet)
      const currWallet = state.wallets.find(w => w.name === action.wallet)

      if (!currWallet) {
        throw new Error('Wallet not found')
      }

      const newKeypair = extendKeypair(action.keypair)
      const updatedWallet: Wallet = {
        ...currWallet,
        keypairs: [...(currWallet?.keypairs || []), newKeypair]
      }
      return {
        ...state,
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
        throw new Error('Wallet not found')
      }

      return {
        ...state,
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
    case 'START_PROXY': {
      if (action.app === ProxyName.Console) {
        return {
          ...state,
          console: {
            ...state.console,
            running: true,
            url: action.url
          }
        }
      } else if (action.app === ProxyName.TokenDApp) {
        return {
          ...state,
          tokenDapp: {
            ...state.tokenDapp,
            running: true,
            url: action.url
          }
        }
      } else {
        throw new Error(`Invalid ProxyApp: ${action.app}`)
      }
    }
    case 'STOP_PROXY': {
      if (action.app === ProxyName.Console) {
        return {
          ...state,
          console: {
            ...state.console,
            running: false,
            url: ''
          }
        }
      } else if (action.app === ProxyName.TokenDApp) {
        return {
          ...state,
          tokenDapp: {
            ...state.tokenDapp,
            running: false,
            url: ''
          }
        }
      } else {
        throw new Error(`Invalid ProxyApp: ${action.app}`)
      }
    }
    case 'STOP_ALL_PROXIES': {
      return {
        ...state,
        console: {
          ...state.console,
          running: false,
          url: ''
        },
        tokenDapp: {
          ...state.tokenDapp,
          running: false,
          url: ''
        }
      }
    }
    default: {
      return state
    }
  }
}
