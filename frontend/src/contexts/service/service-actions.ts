import { Service } from '../../app'
import { ProxyApp, ServiceDispatch } from './service-context'

export function startServiceAction(
  network: string,
  port: number,
  service: Service
) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await service.GetServiceState()

      if (status.Running) {
        await service.StopService()
      }

      dispatch({ type: 'START_SERVICE', port })
      await service.StartService({
        network,
        withConsole: false,
        withTokenDApp: false
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export function stopServiceAction(service: Service) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await service.GetServiceState()
      if (status.Running) {
        await service.StopService()
        dispatch({ type: 'STOP_SERVICE' })
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export function startProxyAction(
  network: string,
  app: ProxyApp,
  port: number,
  service: Service
) {
  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await service.GetServiceState()

      if (status.Running) {
        await service.StopService()
      }

      dispatch({ type: 'START_PROXY', app, port })
      await service.StartService({
        network,
        withConsole: app === ProxyApp.Console,
        withTokenDApp: app === ProxyApp.TokenDApp
      })
    } catch (err) {
      console.log(err)
    }
  }
}
