import {ServiceState} from './service-context'

export const initialServiceState: ServiceState = {
  tokenDAppRunning: false,
  serviceRunning: false,
  serviceUrl: '',
  consoleRunning: false,
  consoleUrl: ''
}

export type ServiceAction =
  | {
      type: 'START_SERVICE'
    }
  | {
      type: 'STOP_SERVICE'
    }
  | {
      type: 'START_CONSOLE'
    }
  | {
      type: 'START_TOKEN_DAPP'
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
        serviceUrl: 'http://127.0.0.1:1789'
      }
    }
    case 'STOP_SERVICE': {
      return {
        ...state,
        serviceRunning: false,
        serviceUrl: '',
        consoleRunning: false,
        tokenDAppRunning: false,
        consoleUrl: ''
      }
    }
    case 'START_CONSOLE': {
      return {
        ...state,
        consoleRunning: true,
        tokenDAppRunning: false,
        consoleUrl: 'http://127.0.0.1:1847'
      }
    }
    case 'START_TOKEN_DAPP': {
      return {
        ...state,
        consoleRunning: false,
        tokenDAppRunning: true,
        consoleUrl: 'http://127.0.0.1:1847'
      }
    }
    default: {
      return state
    }
  }
}
