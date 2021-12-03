import { ServiceState } from './service-context'

export const initialServiceState: ServiceState = {
  running: false,
  url: ''
}

export type ServiceAction = {
  type: 'SET_SERVICE'
  running: boolean
  url: string
}

export function serviceReducer(
  state: ServiceState,
  action: ServiceAction
): ServiceState {
  switch (action.type) {
    case 'SET_SERVICE': {
      return {
        ...state,
        running: action.running,
        url: action.url
      }
    }
    default: {
      return state
    }
  }
}
