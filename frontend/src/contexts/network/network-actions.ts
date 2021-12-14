import { Intent } from '@blueprintjs/core'
import {
  GetNetworkConfig,
  ListNetworks,
  SaveNetworkConfig
} from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Network } from '../../models/network'
import { NetworkDispatch } from './network-context'
import { NetworkAction } from './network-reducer'

export function initNetworksAction() {
  return async (dispatch: NetworkDispatch) => {
    try {
      const networks = await ListNetworks()
      if (networks.networks.length) {
        const defaultNetwork = networks.networks[0]
        const config = await GetNetworkConfig(defaultNetwork)
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
      console.log(err)
    }
  }
}

export function changeNetworkAction(network: string) {
  return async (dispatch: NetworkDispatch) => {
    try {
      const config = await GetNetworkConfig(network)

      dispatch({
        type: 'CHANGE_NETWORK',
        network,
        config
      })
    } catch (err) {
      AppToaster.show({
        message: err as string,
        intent: Intent.DANGER
      })
    }
  }
}

export function updateNetworkConfigAction(config: Network) {
  return async (dispatch: NetworkDispatch) => {
    try {
      const isSuccessful = await SaveNetworkConfig(config)
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
      AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      console.log(err)
    }
  }
}

export function addNetworkAction(network: string): NetworkAction {
  return {
    type: 'ADD_NETWORK',
    network
  }
}
