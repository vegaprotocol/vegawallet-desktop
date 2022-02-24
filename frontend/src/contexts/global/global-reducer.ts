import { extendKeypair, sortWallet } from '../../lib/wallet-helpers'
import type { FirstPublicKey, NamedPubKey } from '../../wailsjs/go/models'
import type { GlobalState, KeyPair, Wallet } from './global-context'
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
  }
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      isInit: boolean
    }
  | {
      type: 'SET_VERSION'
      version: string
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

export function globalReducer(
  state: GlobalState,
  action: GlobalAction
): GlobalState {
  switch (action.type) {
    case 'INIT_APP': {
      return {
        ...state,
        status: action.isInit ? AppStatus.Initialised : AppStatus.Failed
      }
    }
    case 'SET_VERSION': {
      return {
        ...state,
        version: action.version
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
    default: {
      return state
    }
  }
}
