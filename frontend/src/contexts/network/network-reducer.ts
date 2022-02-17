import type { Network } from '../../wailsjs/go/models'
import type { NetworkState } from './network-context'

export const initialNetworkState: NetworkState = {
  network: null,
  networks: [],
  config: null
}

export type NetworkAction =
  | {
      type: 'SET_NETWORKS'
      network: string | null
      networks: string[]
      config: Network | null
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

export function networkReducer(
  state: NetworkState,
  action: NetworkAction
): NetworkState {
  switch (action.type) {
    case 'SET_NETWORKS': {
      return {
        ...state,
        network: action.network,
        networks: action.networks.sort(),
        config: action.config
      }
    }
    case 'CHANGE_NETWORK': {
      return {
        ...state,
        network: action.network,
        config: action.config
      }
    }
    case 'UPDATE_NETWORK_CONFIG': {
      return {
        ...state,
        config: action.config
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
      const config = changeToNewNetwork ? action.config : state.config
      return {
        ...state,
        network,
        networks,
        config
      }
    }
    default: {
      return state
    }
  }
}
