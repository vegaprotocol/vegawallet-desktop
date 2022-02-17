import * as Sentry from '@sentry/react'

import { Service } from '../../service'
import type {
  GetServiceStateResponse,
  StartServiceRequest
} from '../../wailsjs/go/models'
import type { ServiceDispatch } from './service-context'
import { ProxyApp } from './service-context'

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

export function startProxyAction(network: string, app: ProxyApp, port: number) {
  const proxyFns = ProxyFns[app]

  return async (dispatch: ServiceDispatch) => {
    Sentry.addBreadcrumb({
      type: 'StartProxy',
      level: Sentry.Severity.Log,
      message: 'StartProxy',
      data: {
        app,
        network
      },
      timestamp: Date.now()
    })
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({ type: 'START_PROXY', app, port })

      await proxyFns.Start({
        network
      })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

export function stopProxyAction(app: ProxyApp) {
  const proxyFns = ProxyFns[app]

  return async (dispatch: ServiceDispatch) => {
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({ type: 'STOP_PROXY', app })
    } catch (err) {
      Sentry.captureException(err)
      console.log(err)
    }
  }
}

const ProxyFns: {
  [A in ProxyApp]: {
    GetState: () => Promise<GetServiceStateResponse>
    Start: (req: StartServiceRequest) => Promise<boolean | Error>
    Stop: () => Promise<boolean | Error>
  }
} = {
  [ProxyApp.Console]: {
    GetState: Service.GetConsoleState,
    Start: Service.StartConsole,
    Stop: Service.StopConsole
  },
  [ProxyApp.TokenDApp]: {
    GetState: Service.GetTokenDAppState,
    Start: Service.StartTokenDApp,
    Stop: Service.StopTokenDApp
  },
  [ProxyApp.None]: {
    GetState: () => {
      throw new Error('ProxyApp is None')
    },
    Start: () => {
      throw new Error('ProxyApp is None')
    },
    Stop: () => {
      throw new Error('ProxyApp is None')
    }
  }
}
