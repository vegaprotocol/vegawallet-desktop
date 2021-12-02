import { truncateMiddle } from '../../lib/truncate-middle'
import { Key, NamedKeyPair } from '../../models/keys'
import { AppStatus, GlobalState, KeyPair, Wallet } from './global-context'

export const initialGlobalState: GlobalState = {
  status: AppStatus.Pending,
  network: 'devnet',
  networks: ['devnet', 'stagnet', 'fairground', 'mainnet'],
  wallet: null,
  wallets: [],
  passphrase: '',
  drawerOpen: false
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      isInit: boolean
      wallets: string[]
    }
  | {
      type: 'ADD_WALLET'
      wallet: string
    }
  | {
      type: 'SET_KEYPAIRS'
      wallet: string
      keypairs: NamedKeyPair[]
      passphrase: string
    }
  | {
      type: 'ADD_KEYPAIR'
      wallet: string
      keypair: Key
    }
  | {
      type: 'CHANGE_NETWORK'
      network: string
    }
  | {
      type: 'CHANGE_WALLET'
      wallet: string
    }
  | {
      type: 'CHANGE_KEYPAIR'
      keypair: KeyPair
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
          .sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
          })
      }
    }
    case 'ADD_WALLET': {
      return {
        ...state,
        wallets: [
          ...state.wallets,
          { name: action.wallet, keypairs: null, keypair: null }
        ].sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      }
    }
    case 'SET_KEYPAIRS': {
      // Add a 'Name' and 'PublicKeyShort' fields to the keypair object
      const keypairsExtended: KeyPair[] = action.keypairs.map(kp => {
        return {
          ...kp,
          publicKeyShort: truncateMiddle(kp.publicKey)
        }
      })
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
        ].sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        }),
        wallet: newWallet,
        passphrase: action.passphrase
      }
    }
    case 'ADD_KEYPAIR': {
      const wallets = state.wallets.filter(w => w.name !== action.wallet)
      const currWallet = state.wallets.find(w => w.name === action.wallet)

      if (!currWallet) {
        throw new Error('Wallet not found')
      }

      const nameMeta = action.keypair.meta?.find(m => m.key === 'name')

      const newKeypair: KeyPair = {
        ...action.keypair,
        name: nameMeta ? nameMeta.value : 'No name',
        publicKeyShort: truncateMiddle(action.keypair.publicKey)
      }
      const updatedWallet: Wallet = {
        ...currWallet,
        keypairs: [...(currWallet?.keypairs || []), newKeypair]
      }
      return {
        ...state,
        wallets: [...wallets, updatedWallet].sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        }),
        wallet: updatedWallet
      }
    }
    case 'CHANGE_NETWORK': {
      return {
        ...state,
        network: action.network
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
    case 'CHANGE_KEYPAIR': {
      if (!state.wallet) return state

      const keypair = state.wallet.keypairs?.find(
        kp => kp.publicKey === action.keypair.publicKey
      )

      if (!keypair) {
        throw new Error('No keypair found')
      }

      return {
        ...state,
        wallet: {
          ...state.wallet,
          keypair
        }
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
