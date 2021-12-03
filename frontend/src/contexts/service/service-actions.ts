import { ServiceAction } from './service-reducer'

export function setServiceAction(running: boolean, url: string): ServiceAction {
  return { type: 'SET_SERVICE', running, url }
}
