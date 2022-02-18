import type { ServiceState } from './service-context'
import { ProxyApp } from './service-context'

export const initialServiceState: ServiceState = {
  serviceRunning: false,
  serviceUrl: '',
  console: {
    name: ProxyApp.Console,
    running: false,
    url: ''
  },
  tokenDapp: {
    name: ProxyApp.TokenDApp,
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
      app: ProxyApp
      url: string
    }
  | {
      type: 'STOP_PROXY'
      app: ProxyApp
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
      if (action.app === ProxyApp.Console) {
        return {
          ...state,
          console: {
            ...state.console,
            running: true,
            url: action.url
          }
        }
      } else if (action.app === ProxyApp.TokenDApp) {
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
      if (action.app === ProxyApp.Console) {
        return {
          ...state,
          console: {
            ...state.console,
            running: false,
            url: ''
          }
        }
      } else if (action.app === ProxyApp.TokenDApp) {
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
    default: {
      return state
    }
  }
}
