import { GetServiceStateResponse } from '../../models/console-state'
import { Key, NamedKeyPair } from '../../models/keys'
import { ListWalletsResponse } from '../../models/list-wallets'
import { ListNetworksResponse } from '../../models/network'
import { GetVersionResponse } from '../../models/version'
import { GlobalAction } from './global-reducer'

export function initAppSuccessAction(
  networks: ListNetworksResponse,
  wallets: ListWalletsResponse,
  service: GetServiceStateResponse,
  version: GetVersionResponse
): GlobalAction {
  return {
    type: 'INIT_APP',
    isInit: true,
    networks: networks.networks,
    wallets: wallets.wallets,
    serviceRunning: service.Running,
    serviceUrl: service.URL,
    version: version.version
  }
}

export function initAppFailureAction(): GlobalAction {
  return {
    type: 'INIT_APP',
    isInit: false,
    wallets: [],
    networks: [],
    serviceRunning: false,
    serviceUrl: '',
    version: ''
  }
}

export function addWalletAction(wallet: string): GlobalAction {
  return { type: 'ADD_WALLET', wallet }
}

export function setKeypairsAction(
  wallet: string,
  keypairs: NamedKeyPair[]
): GlobalAction {
  return {
    type: 'SET_KEYPAIRS',
    wallet,
    keypairs
  }
}

export function addKeypairAction(wallet: string, keypair: Key): GlobalAction {
  return {
    type: 'ADD_KEYPAIR',
    wallet,
    keypair
  }
}

export function changeNetworkAction(network: string): GlobalAction {
  return { type: 'CHANGE_NETWORK', network }
}

export function setDrawerAction(open: boolean): GlobalAction {
  return { type: 'SET_DRAWER', open }
}

export function setPassphraseModalAction(open: boolean): GlobalAction {
  return { type: 'SET_PASSPHRASE_MODAL', open }
}
