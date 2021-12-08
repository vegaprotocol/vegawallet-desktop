import { ProxyApp, ServiceState } from './service-context'

export const initialServiceState: ServiceState = {
  serviceRunning: false,
  serviceUrl: '',
  proxy: ProxyApp.None,
  proxyUrl: ''
}

export type ServiceAction =
  | {
      type: 'START_SERVICE'
    }
  | {
      type: 'STOP_SERVICE'
    }
  | {
      type: 'START_PROXY'
      app: ProxyApp
    }
  | {
      type: 'STOP_PROXY'
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
        // TODO: Get actual port from backend
        serviceUrl: 'http://127.0.0.1:1789'
      }
    }
    case 'STOP_SERVICE': {
      return {
        ...state,
        serviceRunning: false,
        serviceUrl: '',
        proxy: ProxyApp.None,
        proxyUrl: ''
      }
    }
    case 'START_PROXY': {
      return {
        ...state,
        proxy: action.app,
        // TODO: Get actual port from backend
        proxyUrl: 'http://127.0.0.1:1847'
      }
    }
    case 'STOP_PROXY': {
      return {
        ...state,
        proxy: ProxyApp.None,
        proxyUrl: ''
      }
    }
    default: {
      return state
    }
  }
}
