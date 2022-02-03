import { extendKeypair, sortWallet } from '../../lib/wallet-helpers'
import { Key, NamedKeyPair } from '../../models/keys'
import { AppStatus, GlobalState, KeyPair, Wallet } from './global-context'

export const initialGlobalState: GlobalState = {
  status: AppStatus.Pending,
  version: '',
  wallet: null,
  wallets: [],
  passphraseModalOpen: false,
  drawerOpen: false
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      isInit: boolean
      wallets: string[]
      serviceRunning: boolean
      serviceUrl: string
      version: string
    }
  | {
      type: 'ADD_WALLET'
      wallet: string
      key: Key
    }
  | {
      type: 'SET_KEYPAIRS'
      wallet: string
      keypairs: NamedKeyPair[]
    }
  | {
      type: 'ADD_KEYPAIR'
      wallet: string
      keypair: Key
    }
  | {
      type: 'CHANGE_WALLET'
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
        status: action.isInit ? AppStatus.Initialised : AppStatus.Failed,
        wallets: action.wallets
          .map(w => {
            return {
              name: w,
              keypairs: null,
              keypair: null
            }
          })
          .sort(sortWallet),
        version: action.version
      }
    }
    case 'ADD_WALLET': {
      const keypairExtended: KeyPair = extendKeypair(action.key)
      const newWallet: Wallet = {
        name: action.wallet,
        keypairs: [keypairExtended],
        keypair: keypairExtended
      }
      return {
        ...state,
        wallets: [...state.wallets, newWallet].sort(sortWallet),
        wallet: newWallet
      }
    }
    case 'SET_KEYPAIRS': {
      const keypairsExtended: KeyPair[] = action.keypairs.map(extendKeypair)
      const currWallet = state.wallets.find(w => w.name === action.wallet)
      const newWallet: Wallet = {
        ...currWallet,
        name: action.wallet,
        keypairs: keypairsExtended,
        keypair: keypairsExtended[0]
      }

      return {
        ...state,
        wallets: [
          ...state.wallets.filter(w => w.name !== action.wallet),
          newWallet
        ].sort(sortWallet),
        wallet: newWallet
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
        wallets: [...wallets, updatedWallet].sort(sortWallet),
        wallet: updatedWallet
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
