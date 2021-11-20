import { KeyPair } from '../../models/list-keys'
import { GlobalState } from './global-context'

export const initialGlobalState: GlobalState = {
  init: false,
  network: 'devnet',
  networks: ['devnet', 'stagnet', 'mainnet'],
  wallet: '',
  wallets: [],
  keypair: null,
  keypairs: []
}

export type GlobalAction =
  | {
      type: 'INIT_APP'
      wallets: string[]
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
      keypair: KeyPair
    }

export function globalReducer(
  state: GlobalState,
  action: GlobalAction
): GlobalState {
  switch (action.type) {
    case 'INIT_APP': {
      return {
        ...state,
        wallet: action.wallets[0],
        wallets: action.wallets,
        keypairs: action.keypairs,
        keypair: action.keypairs[0],
        init: true
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
        wallet: action.wallet
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
