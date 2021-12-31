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
      port: number
    }
  | {
      type: 'STOP_SERVICE'
    }
  | {
      type: 'START_PROXY'
      app: ProxyApp
      port: number
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
        serviceUrl: `http://127.0.0.1:${action.port}`
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
        proxyUrl: `http://127.0.0.1:${action.port}`
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
