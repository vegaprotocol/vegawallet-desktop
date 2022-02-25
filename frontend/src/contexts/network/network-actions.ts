import * as Sentry from '@sentry/react'

import { AppToaster } from '../../components/toaster'
import { DataSources } from '../../config/data-sources'
import { Intent } from '../../config/intent'
import { Service } from '../../service'
import type {
  GetServiceStateResponse,
  Network,
  StartServiceRequest
} from '../../wailsjs/go/models'
import type { NetworkDispatch, NetworkState } from './network-context'
import { ProxyName } from './network-context'
import type { NetworkAction } from './network-reducer'

export function initNetworksAction() {
  return async (dispatch: NetworkDispatch) => {
    // fetch network presets
    try {
      const res = await fetch(DataSources.NETWORKS)
      const json = await res.json()
      dispatch({ type: 'SET_PRESETS', presets: json })
    } catch (err) {
      Sentry.captureException(err)
    }

    try {
      const networks = await Service.ListNetworks()
      if (networks instanceof Error) throw networks

      if (networks.networks.length) {
        const defaultNetwork = networks.networks[0]
        const config = await Service.GetNetworkConfig(defaultNetwork)
        dispatch({
          type: 'SET_NETWORKS',
          network: defaultNetwork,
          networks: networks.networks,
          config
        })
      } else {
        dispatch({
          type: 'SET_NETWORKS',
          network: null,
          networks: [],
          config: null
        })
      }
    } catch (err) {
      Sentry.captureException(err)
    }
  }
}

/**
 * Set proxy state on startup. When running the actual app proxies will never be running at
 * startup but if using a browser this ensures proxy state is correct if you reload the window
 * without stopping the backend process.
 */
export function initProxies() {
  return async (dispatch: NetworkDispatch) => {
    try {
      const [consoleState, tokenDappState] = await Promise.all([
        Service.GetConsoleState(),
        Service.GetTokenDAppState()
      ])

      if (consoleState.running) {
        dispatch({
          type: 'START_PROXY',
          app: ProxyName.Console,
          url: consoleState.url
        })
      }

      if (tokenDappState.running) {
        dispatch({
          type: 'START_PROXY',
          app: ProxyName.TokenDApp,
          url: tokenDappState.url
        })
      }
    } catch (err) {
      Sentry.captureException(err)
    }
  }
}

export function changeNetworkAction(network: string) {
  return async (dispatch: NetworkDispatch) => {
    Sentry.addBreadcrumb({
      type: 'ChangeNetwork',
      level: Sentry.Severity.Log,
      message: 'ChangeNetwork',
      timestamp: Date.now()
    })

    try {
      await stopProxies()
      dispatch({ type: 'STOP_ALL_PROXIES' })

      const config = await Service.GetNetworkConfig(network)

      dispatch({
        type: 'CHANGE_NETWORK',
        network,
        config
      })
    } catch (err) {
      Sentry.captureException(err)
      AppToaster.show({
        message: err as string,
        intent: Intent.DANGER
      })
    }
  }
}

export function updateNetworkConfigAction(
  editingNetwork: string,
  config: Network
) {
  return async (dispatch: NetworkDispatch, getState: () => NetworkState) => {
    const state = getState()

    Sentry.addBreadcrumb({
      type: 'UpdateNetworkConfig',
      level: Sentry.Severity.Log,
      message: 'UpdateNetworkConfig',
      timestamp: Date.now()
    })

    try {
      // Stop main REST service if you are editing the active network config
      if (state.network === editingNetwork) {
        const serviceStatus = await Service.GetServiceState()
        if (serviceStatus.running) {
          await Service.StopService()
        }
      }

      await stopProxies()
      dispatch({ type: 'STOP_ALL_PROXIES' })

      const isSuccessful = await Service.SaveNetworkConfig(config)

      if (isSuccessful) {
        AppToaster.show({
          message: 'Configuration saved',
          intent: Intent.SUCCESS
        })
        dispatch({ type: 'UPDATE_NETWORK_CONFIG', config })
      } else {
        AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
      }

      if (!state.network) {
        throw new Error('No network selected')
      }

      await Service.StartService({
        network: state.network
      })
    } catch (err) {
      Sentry.captureException(err)
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
    }
  }
}

export function addNetworkAction(
  network: string,
  config: Network
): NetworkAction {
  return {
    type: 'ADD_NETWORK',
    network,
    config
  }
}

export function startServiceAction(network: string, port: number) {
  return async (dispatch: NetworkDispatch) => {
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

      await Service.StartService({
        network
      })

      dispatch({ type: 'START_SERVICE', port })
    } catch (err) {
      Sentry.captureException(err)
    }
  }
}

export function stopServiceAction() {
  return async (dispatch: NetworkDispatch) => {
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
    }
  }
}

export function startProxyAction(
  network: string,
  proxyAppName: ProxyName,
  url: string
) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: NetworkDispatch) => {
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
    }
  }
}

export function stopProxyAction(proxyAppName: ProxyName) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: NetworkDispatch) => {
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({ type: 'STOP_PROXY', app: proxyAppName })
    } catch (err) {
      Sentry.captureException(err)
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

async function stopProxies() {
  try {
    // Stop Console
    const consoleStatus = await Service.GetConsoleState()
    if (consoleStatus.running) {
      await Service.StopConsole()
    }

    // Stop TokenDapp
    const tokenDappStatus = await Service.GetTokenDAppState()
    if (tokenDappStatus.running) {
      await Service.StopTokenDApp()
    }
  } catch (err) {
    Sentry.captureException(err)
  }
}
