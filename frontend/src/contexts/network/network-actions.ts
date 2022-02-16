import * as Sentry from '@sentry/react'

import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import type { ImportNetworkRequest, Network } from '../../models/network'
import { Service } from '../../service'
import type { NetworkDispatch } from './network-context'
import type { NetworkAction } from './network-reducer'

export function initNetworksAction() {
  return async (dispatch: NetworkDispatch) => {
    try {
      const networks = await Service.ListNetworks()
      if (networks instanceof Error) throw networks

      if (networks.networks.length) {
        const defaultNetwork = networks.networks[0]
        const config = (await Service.GetNetworkConfig(
          defaultNetwork
        )) as Network
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
      console.log(err)
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
      const config = (await Service.GetNetworkConfig(network)) as Network

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

export function updateNetworkConfigAction(config: Network) {
  return async (dispatch: NetworkDispatch) => {
    Sentry.addBreadcrumb({
      type: 'UpdateNetworkConfig',
      level: Sentry.Severity.Log,
      message: 'UpdateNetworkConfig',
      timestamp: Date.now()
    })
    try {
      const isSuccessful = await Service.SaveNetworkConfig(config)
      if (isSuccessful) {
        AppToaster.show({
          message: 'Configuration saved. All services stopped.',
          intent: Intent.SUCCESS
        })
        dispatch({ type: 'UPDATE_NETWORK_CONFIG', config })
      } else {
        AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
      }
    } catch (err) {
      Sentry.captureException(err)
      AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      console.log(err)
    }
  }
}

export function importNetworkAction(values: ImportNetworkRequest) {
  return async (dispatch: NetworkDispatch) => {
    Sentry.addBreadcrumb({
      type: 'ImportNetworkConfig',
      level: Sentry.Severity.Log,
      message: 'ImportNetworkConfig',
      timestamp: Date.now()
    })
    try {
      const res = await Service.ImportNetwork({
        name: values.name,
        url: values.url,
        filePath: values.filePath,
        force: values.force
      })
      if (res instanceof Error) throw res

      if (res) {
        const config = (await Service.GetNetworkConfig(res.name)) as Network
        dispatch({
          type: 'ADD_NETWORK',
          network: res.name,
          config: config
        })

        AppToaster.show({
          message: `Network imported from ${res.filePath}`,
          intent: Intent.SUCCESS
        })
      } else {
        AppToaster.show({
          message: 'Error: Could not import network',
          intent: Intent.DANGER
        })
      }
    } catch (err) {
      Sentry.captureException(err)
      AppToaster.show({
        message: `Error: ${err}`,
        intent: Intent.DANGER
      })
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
