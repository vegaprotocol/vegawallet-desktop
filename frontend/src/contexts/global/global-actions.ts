import * as Service from '../../api/service'
import { requestPassphrase } from '../../components/passphrase-modal'
import { GetServiceStateResponse } from '../../models/console-state'
import { ListWalletsResponse } from '../../models/wallet'
import { GetVersionResponse } from '../../models/version'
import { GlobalDispatch, GlobalState } from './global-context'
import { GlobalAction } from './global-reducer'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import { Key } from '../../models/keys'
import * as Sentry from '@sentry/react'

export function initAppAction() {
  return async (dispatch: GlobalDispatch) => {
    try {
      const isInit = await Service.IsAppInitialised()

      if (isInit) {
        // App initialised check what wallets are available
        const res = await Promise.all([
          await Service.ListWallets(),
          await Service.GetServiceState(),
          await Service.GetVersion()
        ])

        dispatch(initAppSuccessAction(...res))
      } else {
        dispatch(startOnboardingAction())
      }
    } catch (err) {
      Sentry.captureException(err)
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

export function addWalletAction(wallet: string, key: Key): GlobalAction {
  return { type: 'ADD_WALLET', wallet, key }
}

export function addKeypairAction(wallet: string) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    try {
      const passphrase = await requestPassphrase()
      const res = await Service.GenerateKey({
        wallet,
        passphrase,
        metadata: []
      })
      dispatch({
        type: 'ADD_KEYPAIR',
        wallet,
        keypair: res
      })
    } catch (err) {
      if (err !== 'dismissed') {
        Sentry.captureException(err)
        console.log(err)
        AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
      }
    }
  }
}

export function getKeysAction(wallet: string, cb: Function) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()
    const selectedWallet = state.wallets.find(w => w.name === wallet)

    if (selectedWallet?.keypairs) {
      dispatch({ type: 'CHANGE_WALLET', wallet })
      cb()
    } else {
      try {
        const passphrase = await requestPassphrase()
        const keys = await Service.ListKeys({ wallet, passphrase })
        dispatch({ type: 'SET_KEYPAIRS', wallet, keypairs: keys.keys || [] })
        cb()
      } catch (err) {
        console.log(err)
        if (err !== 'dismissed') {
          Sentry.captureException(err)
          AppToaster.show({ message: `Error: ${err}`, intent: Intent.DANGER })
        }
      }
    }
  }
}

export function setPassphraseModalAction(open: boolean): GlobalAction {
  return { type: 'SET_PASSPHRASE_MODAL', open }
}

export function setDrawerAction(open: boolean): GlobalAction {
  return { type: 'SET_DRAWER', open }
}

export function startOnboardingAction(): GlobalAction {
  return {
    type: 'START_ONBOARDING'
  }
}
