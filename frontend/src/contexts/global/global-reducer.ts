import { truncateMiddle } from '../../lib/truncate-middle'
import { KeyPair } from '../../models/list-keys'
import { GlobalState, KeyPairExtended } from './global-context'

export const initialGlobalState: GlobalState = {
  init: false,
  network: 'devnet',
  networks: ['devnet', 'stagnet', 'fairground', 'mainnet'],
  wallet: '',
  wallets: [],
  keypair: null,
  keypairs: null
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      wallets: string[]
      keypairs: KeyPair[]
    }
  | {
      type: 'SET_WALLETS'
      wallets: string[]
    }
  | {
      type: 'SET_KEYPAIRS'
      keypairs: KeyPair[]
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
      keypair: KeyPairExtended
    }

export function globalReducer(
  state: GlobalState,
  action: GlobalAction
): GlobalState {
  switch (action.type) {
    case 'INIT_APP': {
      const keypairsExtended = action.keypairs.map(kp => {
        const nameMeta = kp.Meta.find(m => m.Key === 'name')
        return {
          ...kp,
          Name: nameMeta ? nameMeta.Value : 'No name',
          PublicKeyShort: truncateMiddle(kp.PublicKey)
        }
      })
      return {
        ...state,
        wallet: action.wallets[0],
        wallets: action.wallets,
        keypairs: keypairsExtended,
        keypair: keypairsExtended[0],
        init: true
      }
    }
    case 'SET_WALLETS': {
      return {
        ...state,
        wallets: action.wallets
      }
    }
    case 'SET_KEYPAIRS': {
      const keypairsExtended = action.keypairs.map(kp => {
        const nameMeta = kp.Meta.find(m => m.Key === 'name')
        return {
          ...kp,
          Name: nameMeta ? nameMeta.Value : 'No name',
          PublicKeyShort: truncateMiddle(kp.PublicKey)
        }
      })
      return {
        ...state,
        keypairs: keypairsExtended,
        keypair: keypairsExtended[0]
      }
    }
    case 'CHANGE_NETWORK': {
      return {
        ...state,
        network: action.network
      }
    }
    case 'CHANGE_WALLET': {
      return {
        ...state,
        wallet: action.wallet,
        keypairs: null,
        keypair: null
      }
    }
    case 'CHANGE_KEYPAIR': {
      return {
        ...state,
        keypair: action.keypair
      }
    }
    default: {
      return state
    }
  }
}
