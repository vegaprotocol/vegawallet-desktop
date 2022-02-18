import type { ServiceState } from './service-context'
import { ProxyName } from './service-context'

export const initialServiceState: ServiceState = {
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

export type ServiceAction =
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

export function serviceReducer(
  state: ServiceState,
  action: ServiceAction
): ServiceState {
  switch (action.type) {
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
