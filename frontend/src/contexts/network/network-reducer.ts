import type { Network } from '../../wailsjs/go/models'
import type { NetworkPreset, NetworkState } from './network-context'
import { ProxyName } from './network-context'

export const initialNetworkState: NetworkState = {
  network: null,
  networks: [],
  presets: [],
  config: null,
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

export type NetworkAction =
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
    case 'ADD_NETWORKS': {
      const newNetworks = action.networks.filter(
        n => state.networks.indexOf(n) < 0
      )
      return {
        ...state,
        networks: [...state.networks, ...newNetworks]
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
