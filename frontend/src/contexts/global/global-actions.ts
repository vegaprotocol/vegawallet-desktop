import * as Sentry from '@sentry/react'

import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import type { Key } from '../../models/keys'
import { Service } from '../../service'
import type {
  GetServiceStateResponse,
  GetVersionResponse,
  ListWalletsResponse
} from '../../wailsjs/go/models'
import { GenerateKeyRequest } from '../../wailsjs/go/models'
import type { GlobalDispatch, GlobalState } from './global-context'
import type { GlobalAction } from './global-reducer'

export function initAppAction() {
  return async (dispatch: GlobalDispatch) => {
    try {
      const isInit = await Service.IsAppInitialised()

      if (isInit) {
        Sentry.addBreadcrumb({
          type: 'InitApp',
          level: Sentry.Severity.Log,
          message: 'InitApp',
          timestamp: Date.now()
        })
        // App initialised check what wallets are available
        const [wallets, service, version] = await Promise.all([
          await Service.ListWallets(),
          await Service.GetServiceState(),
          await Service.GetVersion()
        ])

        if (wallets instanceof Error) {
          throw wallets
        }

        dispatch(initAppSuccessAction(wallets, service, version))
      } else {
        Sentry.addBreadcrumb({
          type: 'StartApp',
          level: Sentry.Severity.Log,
          message: 'StartApp',
          timestamp: Date.now()
        })
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
    serviceRunning: service.running,
    serviceUrl: service.url,
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
  return async (dispatch: GlobalDispatch) => {
    Sentry.addBreadcrumb({
      type: 'AddKeyPair',
      level: Sentry.Severity.Log,
      message: 'AddKeyPair',
      timestamp: Date.now()
    })
    try {
      const passphrase = await requestPassphrase()
      const res = await Service.GenerateKey(
        new GenerateKeyRequest({
          wallet,
          passphrase,
          metadata: []
        })
      )

      if (res instanceof Error) throw res

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

export function getKeysAction(wallet: string) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()
    const selectedWallet = state.wallets.find(w => w.name === wallet)

    if (selectedWallet?.keypairs) {
      Sentry.addBreadcrumb({
        type: 'ChangeWallet',
        level: Sentry.Severity.Log,
        message: 'ChangeWallet',
        timestamp: Date.now()
      })
      dispatch({ type: 'ACTIVATE_WALLET', wallet })
    } else {
      try {
        const passphrase = await requestPassphrase()
        const keys = await Service.ListKeys({
          wallet,
          passphrase
        })
        if (keys instanceof Error) {
          throw keys
        }
        dispatch({ type: 'SET_KEYPAIRS', wallet, keypairs: keys.keys || [] })
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

export function chnageWalletAction(wallet: string): GlobalAction {
  return {
    type: 'CHANGE_WALLET',
    wallet
  }
}

export function deactivateWalletAction(wallet: string): GlobalAction {
  return {
    type: 'DEACTIVATE_WALLET',
    wallet
  }
}
