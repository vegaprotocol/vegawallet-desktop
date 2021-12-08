import { GetNetworkConfig, ListNetworks } from '../../api/service'
import { NetworkDispatch } from './network-context'

export function initNetworksAction() {
  return async (dispatch: NetworkDispatch) => {
    try {
      const networks = await ListNetworks()
      const defaultNetwork = networks.networks[0]
      const config = await GetNetworkConfig(defaultNetwork)
      console.log(config)

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
