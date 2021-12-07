import { ServiceState } from './service-context'

export const initialServiceState: ServiceState = {
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
        consoleUrl: ''
      }
    }
    case 'START_CONSOLE': {
      return {
        ...state,
        consoleRunning: true,
        consoleUrl: 'http://127.0.0.1:1847'
      }
    }
    default: {
      return state
    }
  }
}
