import {GetServiceState, StartService, StopService} from '../../api/service'
import {ServiceDispatch} from './service-context'

export function startServiceAction(network: string) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await GetServiceState()

      if (status.Running) {
        await StopService()
      }

      dispatch({type: 'START_SERVICE'})
      await StartService({network, withConsole: false, withTokenDApp: false})
    } catch (err) {
      console.log(err)
    }
  }
}

export function stopServiceAction() {
  return async (dispatch: ServiceDispatch) => {
    try {
      await StopService()
      dispatch({type: 'STOP_SERVICE'})
    } catch (err) {
      console.log(err)
    }
  }
}

export function startConsoleAction(network: string) {
  return async (dispatch: ServiceDispatch) => {
    try {
      await StopService()
      dispatch({type: 'START_CONSOLE'})
      await StartService({network, withConsole: true, withTokenDApp: false})
    } catch (err) {
      console.log(err)
    }
  }
}

export function startTokenDAppAction(network: string) {
  return async (dispatch: ServiceDispatch) => {
    try {
      await StopService()
      dispatch({type: 'START_TOKEN_DAPP'})
      await StartService({network, withConsole: false, withTokenDApp: true})
    } catch (err) {
      console.log(err)
    }
  }
}
