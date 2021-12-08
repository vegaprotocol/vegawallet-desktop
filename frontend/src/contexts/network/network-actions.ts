import {
  GetNetworkConfig,
  ListNetworks,
  SaveNetworkConfig
} from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { Network } from '../../models/network'
import { NetworkDispatch } from './network-context'

export function initNetworksAction() {
  return async (dispatch: NetworkDispatch) => {
    try {
      const networks = await ListNetworks()
      const defaultNetwork = networks.networks[0]
      const config = await GetNetworkConfig(defaultNetwork)

      dispatch({
        type: 'SET_NETWORKS',
        network: defaultNetwork,
        networks: networks.networks,
        config
      })
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
      console.log(err)
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
          color: Colors.GREEN
        })
        dispatch({ type: 'UPDATE_NETWORK_CONFIG', config })
      } else {
        AppToaster.show({ message: 'Error: Unknown', color: Colors.RED })
      }
    } catch (err) {
      AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
      console.log(err)
    }
  }
}
