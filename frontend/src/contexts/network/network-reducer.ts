import { Network } from '../../models/network'
import { NetworkState } from './network-context'

export const initialNetworkState: NetworkState = {
  network: null,
  networks: [],
  config: null
}

export type NetworkAction =
  | {
      type: 'SET_NETWORKS'
      network: string
      networks: string[]
      config: Network
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

export function networkReducer(
  state: NetworkState,
  action: NetworkAction
): NetworkState {
  switch (action.type) {
    case 'SET_NETWORKS': {
      return {
        ...state,
        network: action.network,
        networks: action.networks,
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
    default: {
      return state
    }
  }
}
