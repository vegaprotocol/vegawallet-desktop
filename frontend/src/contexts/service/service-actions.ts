import { GetServiceState, StartService, StopService } from '../../api/service'
import { ProxyApp, ServiceDispatch } from './service-context'

export function startServiceAction(network: string, port: number) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await GetServiceState()

      if (status.Running) {
        await StopService()
      }

      dispatch({ type: 'START_SERVICE', port })
      await StartService({ network, withConsole: false, withTokenDApp: false })
    } catch (err) {
      console.log(err)
    }
  }
}

export function stopServiceAction() {
  return async (dispatch: ServiceDispatch) => {
    try {
      await StopService()
      dispatch({ type: 'STOP_SERVICE' })
    } catch (err) {
      console.log(err)
    }
  }
}

export function startProxyAction(network: string, app: ProxyApp, port: number) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await GetServiceState()

      if (status.Running) {
        await StopService()
      }

      dispatch({ type: 'START_PROXY', app, port })
      await StartService({
        network,
        withConsole: app === ProxyApp.Console,
        withTokenDApp: app === ProxyApp.TokenDApp
      })
    } catch (err) {
      console.log(err)
    }
  }
}
