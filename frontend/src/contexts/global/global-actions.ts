import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { DataSources } from '../../config/data-sources'
import { DEFAULT_VEGA_HOME, IS_TEST_MODE } from '../../config/environment'
import { Intent } from '../../config/intent'
import { createLogger } from '../../lib/logging'
import { Service } from '../../service'
import type {
  Config,
  FirstPublicKey,
  GetServiceStateResponse,
  Network,
  StartServiceRequest
} from '../../wailsjs/go/models'
import { GenerateKeyRequest } from '../../wailsjs/go/models'
import type { GlobalDispatch, GlobalState } from './global-context'
import { ProxyName } from './global-context'
import type { GlobalAction } from './global-reducer'

const logger = createLogger('GlobalActions')

export function initAppAction() {
  return async (dispatch: GlobalDispatch) => {
    let isInit = false
    let appConfig: Config | null = null
    let defaultNetwork = null
    let defaultNetworkConfig = null

    try {
      isInit = await Service.IsAppInitialised()
    } catch (err) {
      logger.error(err)
    }

    if (isInit) {
      try {
        appConfig = await Service.GetAppConfig()
        dispatch({ type: 'SET_CONFIG', config: appConfig })
      } catch (err) {
        console.log('failed to get config', err)
      }
    }

    try {
      const version = await Service.GetVersion()

      dispatch({ type: 'SET_VERSION', version: version.version })

      if (IS_TEST_MODE) {
        await Service.InitialiseApp({ vegaHome: DEFAULT_VEGA_HOME })
      } else if (!isInit) {
        const existingConfig = await Service.SearchForExistingConfiguration()

        logger.debug('StartApp')

        // start default onboarding
        dispatch({ type: 'START_ONBOARDING', existing: existingConfig })
        return
      }

      logger.debug('InitApp')

      // HAPPY PATH: returning desktop wallet user
      const res = await Service.ListWallets()
      dispatch({ type: 'ADD_WALLETS', wallets: res.wallets })
      dispatch({ type: 'INIT_APP', isInit: true })
    } catch (err) {
      dispatch({ type: 'INIT_APP', isInit: false })
      logger.error(err)
    }

    try {
      const res = await fetch(DataSources.NETWORKS)
      const json = await res.json()
      dispatch({ type: 'SET_PRESETS', presets: json })
    } catch (err) {
      logger.error(err)
    }

    try {
      const networks = await Service.ListNetworks()
      if (networks instanceof Error) throw networks

      if (networks.networks.length) {
        defaultNetwork = networks.networks[0]

        if (appConfig?.defaultNetwork) {
          defaultNetwork =
            networks.networks.find(n => n === appConfig?.defaultNetwork) ||
            networks.networks[0]
        }

        defaultNetworkConfig = await Service.GetNetworkConfig(defaultNetwork)

        dispatch({
          type: 'SET_NETWORKS',
          network: defaultNetwork,
          networks: networks.networks,
          config: defaultNetworkConfig
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
      logger.error(err)
    }

    /**
     * Set proxy state on startup. When running the actual app proxies will never be running at
     * startup but if using a browser this ensures proxy state is correct if you reload the window
     * without stopping the backend process.
     */
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
      logger.error(err)
    }

    logger.debug('StartService')
    try {
      const status = await Service.GetServiceState()

      if (status.running) {
        await Service.StopService()
      }

      if (defaultNetwork && defaultNetworkConfig) {
        await Service.StartService({
          network: defaultNetwork
        })
        dispatch({ type: 'START_SERVICE', port: defaultNetworkConfig.port })
      }
    } catch (err) {
      logger.error(err)
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
    logger.debug('AddKeyPair')
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
        AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
        logger.error(err)
      }
    }
  }
}

export function getKeysAction(wallet: string) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()
    const selectedWallet = state.wallets.find(w => w.name === wallet)

    if (selectedWallet?.keypairs) {
      dispatch({ type: 'ACTIVATE_WALLET', wallet })
      logger.debug('ChangeWallet')
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
          AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
          logger.error(err)
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

// Network actions

export function changeNetworkAction(network: string) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()

    logger.debug('ChangeNetwork')

    try {
      await stopProxies()
      dispatch({ type: 'STOP_ALL_PROXIES' })

      console.log(state.config)
      // Save selected network to app config
      const logLevel = state.config
        ? state.config.logLevel.charAt(0).toUpperCase() +
          state.config.logLevel.slice(1)
        : 'Info'
      await Service.UpdateAppConfig({
        ...state.config,
        logLevel,
        defaultNetwork: network
      })

      const config = await Service.GetNetworkConfig(network)

      dispatch({
        type: 'CHANGE_NETWORK',
        network,
        config
      })
    } catch (err) {
      AppToaster.show({
        message: `${err}`,
        intent: Intent.DANGER
      })
      logger.error(err)
    }
  }
}

export function updateNetworkConfigAction(
  editingNetwork: string,
  config: Network
) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()

    logger.debug('UpdateNetworkConfig')

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
      AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
      logger.error(err)
    }
  }
}

export function addNetworkAction(network: string, config: Network) {
  return async (dispatch: GlobalDispatch) => {
    // If no service running start service for newly added network
    try {
      const status = await Service.GetServiceState()
      if (!status.running) {
        await Service.StartService({ network })
        dispatch({ type: 'START_SERVICE', port: config.port })
      }
    } catch (err) {
      Sentry.captureException(err)
    }

    dispatch({
      type: 'ADD_NETWORK',
      network,
      config
    })
  }
}

export function stopServiceAction() {
  return async (dispatch: GlobalDispatch) => {
    logger.debug('StopService')
    try {
      const status = await Service.GetServiceState()
      if (status.running) {
        await Service.StopService()
        dispatch({ type: 'STOP_SERVICE' })
      }
    } catch (err) {
      logger.error(err)
    }
  }
}

export function startProxyAction(
  network: string,
  proxyAppName: ProxyName,
  url: string
) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: GlobalDispatch) => {
    logger.debug('StartProxy:', proxyAppName, network)
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
      logger.error(err)
    }
  }
}

export function stopProxyAction(proxyAppName: ProxyName) {
  const proxyFns = ProxyFns[proxyAppName]

  return async (dispatch: GlobalDispatch) => {
    try {
      const status = await proxyFns.GetState()

      if (status.running) {
        await proxyFns.Stop()
      }

      dispatch({ type: 'STOP_PROXY', app: proxyAppName })
    } catch (err) {
      logger.error(err)
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
    logger.error(err)
  }
}
