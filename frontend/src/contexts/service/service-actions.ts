import { ServiceAction } from './service-reducer'

export function startServiceAction(): ServiceAction {
  return { type: 'START_SERVICE' }
}

export function stopServiceAction(): ServiceAction {
  return { type: 'STOP_SERVICE' }
}

export function startConsoleAction(): ServiceAction {
  return { type: 'START_CONSOLE' }
}
