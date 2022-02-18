import * as Sentry from '@sentry/react'

import { Service } from '../../service'
import type {
  GetServiceStateResponse,
  StartServiceRequest
} from '../../wailsjs/go/models'
import type { ServiceDispatch } from './service-context'
import { ProxyName } from './service-context'

export function startServiceAction(network: string, port: number) {
  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StartService',
      level: Sentry.Severity.Log,
      message: 'StartService',
      timestamp: Date.now()
    })
    try {
      const status = await Service.GetServiceState()

      if (status.running) {
        await Service.StopService()
      }

      dispatch({ type: 'START_SERVICE', port })

      await Service.StartService({
        network
      })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function stopServiceAction() {
  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StopService',
      level: Sentry.Severity.Log,
      message: 'StopService',
      timestamp: Date.now()
    })
    try {
      const status = await Service.GetServiceState()
      if (status.running) {
        await Service.StopService()
        dispatch({ type: 'STOP_SERVICE' })
      }
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function startProxyAction(
  network: string,
  proxyAppName: ProxyName,
  url: string
) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StartProxy',
      level: Sentry.Severity.Log,
      message: 'StartProxy',
      data: {
        app: proxyAppName,
        network
      },
      timestamp: Date.now()
    })
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({
        type: 'START_PROXY',
        app: proxyAppName,
        url
      })

      await proxyFns.Start({
        network
      })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function stopProxyAction(proxyAppName: ProxyName) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({ type: 'STOP_PROXY', app: proxyAppName })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

const ProxyFns: {
  [A in ProxyName]: {
    GetState: () => Promise<GetServiceStateResponse>
    Start: (req: StartServiceRequest) => Promise<boolean | Error>
    Stop: () => Promise<boolean | Error>
  }
} = {
  [ProxyName.Console]: {
    GetState: Service.GetConsoleState,
    Start: Service.StartConsole,
    Stop: Service.StopConsole
  },
  [ProxyName.TokenDApp]: {
    GetState: Service.GetTokenDAppState,
    Start: Service.StartTokenDApp,
    Stop: Service.StopTokenDApp
  }
}
