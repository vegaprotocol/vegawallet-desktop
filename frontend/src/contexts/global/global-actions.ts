import * as Sentry from '@sentry/react'

import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { DEFAULT_VEGA_HOME, IS_TEST_MODE } from '../../config/environment'
import { Intent } from '../../config/intent'
import { Service } from '../../service'
import type { FirstPublicKey } from '../../wailsjs/go/models'
import { GenerateKeyRequest } from '../../wailsjs/go/models'
import type { GlobalDispatch, GlobalState } from './global-context'
import type { GlobalAction } from './global-reducer'

export function initAppAction() {
  return async (dispatch: GlobalDispatch) => {
    try {
      const [isInit, version, config] = await Promise.all([
        Service.IsAppInitialised(),
        Service.GetVersion(),
        Service.GetAppConfig()
      ])

      dispatch({ type: 'SET_VERSION', version: version.version })
      dispatch({ type: 'SET_CONFIG', config: config })

      if (IS_TEST_MODE) {
        await Service.InitialiseApp({ vegaHome: DEFAULT_VEGA_HOME })
      } else if (!isInit) {
        const existingConfig = await Service.SearchForExistingConfiguration()

        Sentry.addBreadcrumb({
          type: 'StartApp',
          level: Sentry.Severity.Log,
          message: 'StartApp',
          timestamp: Date.now()
        })

        // start default onboarding
        dispatch({ type: 'START_ONBOARDING', existing: existingConfig })
        return
      }

      Sentry.addBreadcrumb({
        type: 'InitApp',
        level: Sentry.Severity.Log,
        message: 'InitApp',
        timestamp: Date.now()
      })

      // HAPPY PATH: returning desktop wallet user
      const res = await Service.ListWallets()
      dispatch({ type: 'ADD_WALLETS', wallets: res.wallets })
      dispatch({ type: 'INIT_APP', isInit: true })
    } catch (err) {
      Sentry.captureException(err)
      dispatch({ type: 'INIT_APP', isInit: false })
    }
  }
}

export function initAppSuccessAction(): GlobalAction {
  return {
    type: 'INIT_APP',
    isInit: true
  }
}

export function initAppFailureAction(): GlobalAction {
  return {
    type: 'INIT_APP',
    isInit: false
  }
}

export function addWalletAction(
  wallet: string,
  key: FirstPublicKey
): GlobalAction {
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

      dispatch({
        type: 'ADD_KEYPAIR',
        wallet,
        keypair: res
      })
    } catch (err) {
      if (err !== 'dismissed') {
        Sentry.captureException(err)
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
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
        if (err !== 'dismissed') {
          Sentry.captureException(err)
          AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
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
