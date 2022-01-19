import { requestPassphrase } from '../../components/passphrase-modal'
import { GetServiceStateResponse } from '../../models/console-state'
import { ListWalletsResponse } from '../../models/list-wallets'
import { GetVersionResponse } from '../../models/version'
import { GlobalDispatch, GlobalState } from './global-context'
import { GlobalAction } from './global-reducer'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import { Service } from '../../app'

export function initAppAction(service: Service) {
  return async (dispatch: GlobalDispatch) => {
    try {
      const isInit = await service.IsAppInitialised()

      if (!isInit) {
        await service.InitialiseApp({
          vegaHome: process.env.REACT_APP_VEGA_HOME || ''
        })
      }

      // App initialised check what wallets are available
      const res = await Promise.all([
        await service.ListWallets(),
        await service.GetServiceState(),
        await service.GetVersion()
      ])

      dispatch(initAppSuccessAction(...res))
    } catch (err) {
      dispatch(initAppFailureAction())
    }
  }
}

export function initAppSuccessAction(
  wallets: ListWalletsResponse,
  service: GetServiceStateResponse,
  version: GetVersionResponse
): GlobalAction {
  return {
    type: 'INIT_APP',
    isInit: true,
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
    serviceRunning: false,
    serviceUrl: '',
    version: ''
  }
}

export function addWalletAction(wallet: string): GlobalAction {
  return { type: 'ADD_WALLET', wallet }
}

export function addKeypairAction(wallet: string, service: Service) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    try {
      const passphrase = await requestPassphrase()
      const res = await service.GenerateKey({
        wallet,
        passphrase,
        metadata: []
      })
      dispatch({
        type: 'ADD_KEYPAIR',
        wallet,
        keypair: res.key
      })
    } catch (err) {
      if (err !== 'dismissed') {
        console.log(err)
        AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      }
    }
  }
}

export function getKeysAction(wallet: string, cb: Function, service: Service) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()
    const selectedWallet = state.wallets.find(w => w.name === wallet)

    if (selectedWallet?.keypairs) {
      dispatch({ type: 'CHANGE_WALLET', wallet })
      cb()
    } else {
      try {
        const passphrase = await requestPassphrase()
        const keys = await service.ListKeys({ wallet, passphrase })
        dispatch({ type: 'SET_KEYPAIRS', wallet, keypairs: keys.keys || [] })
        cb()
      } catch (err) {
        console.log(err)
        if (err !== 'dismissed') {
          AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
        }
      }
    }
  }
}

export function setDrawerAction(open: boolean): GlobalAction {
  return { type: 'SET_DRAWER', open }
}

export function setPassphraseModalAction(open: boolean): GlobalAction {
  return { type: 'SET_PASSPHRASE_MODAL', open }
}
