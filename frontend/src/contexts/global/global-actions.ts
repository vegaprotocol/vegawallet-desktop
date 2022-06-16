import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { DataSources } from '../../config/data-sources'
import { DEFAULT_VEGA_HOME, IS_TEST_MODE } from '../../config/environment'
import { Intent } from '../../config/intent'
import { createLogger } from '../../lib/logging'
import { Service } from '../../service'
import type {
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
    const isInit = await Service.IsAppInitialised()

    // Test mode we want to auto initialise with a specific vega home to bypass
    // having to go through the onboarding flow for each test
    if (IS_TEST_MODE && !isInit) {
      await Service.InitialiseApp({ vegaHome: DEFAULT_VEGA_HOME })
    }

    const [version, presets] = await Promise.all([
      Service.GetVersion(),
      fetch(DataSources.NETWORKS).then(res => res.json())
    ])

    dispatch({ type: 'SET_VERSION', version: version.version })
    dispatch({ type: 'SET_PRESETS', presets })

    if (!isInit) {
      const existingConfig = await Service.SearchForExistingConfiguration()
      dispatch({ type: 'START_ONBOARDING', existing: existingConfig })
      return
    }

    // should now have an app config
    const [config, wallets, networks] = await Promise.all([
      Service.GetAppConfig(),
      Service.ListWallets(),
      Service.ListNetworks()
    ])

    const defaultNetwork = config.defaultNetwork
      ? networks.networks.find(n => n === config.defaultNetwork) ||
        networks.networks[0]
      : networks.networks[0]

    const defaultNetworkConfig = defaultNetwork
      ? await Service.GetNetworkConfig(defaultNetwork)
      : null

    // check service and proxy states
    const [service, consoleState, tokenDappState] = await Promise.all([
      Service.GetServiceState(),
      Service.GetConsoleState(),
      Service.GetTokenDAppState()
    ])

    if (service.running) {
      await Service.StopService() // unlikely but stop service in case it was accidently left hanging
    }

    const canStartService = Boolean(defaultNetwork && defaultNetworkConfig)
    if (canStartService) {
      await Service.StartService({ network: defaultNetwork })
    }

    dispatch({
      type: 'INIT_APP',
      isInit: true,
      wallets: wallets.wallets,
      network: defaultNetwork,
      networks: networks.networks,
      networkConfig: defaultNetworkConfig,
      presetNetworks: presets,
      startService: canStartService,
      console: {
        name: ProxyName.Console,
        url: consoleState.url,
        running: consoleState.running
      },
      tokenDapp: {
        name: ProxyName.TokenDApp,
        url: tokenDappState.url,
        running: tokenDappState.running
      }
    })
  }
}

export function completeOnboardAction(onComplete: () => void) {
  return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
    const state = getState()
    try {
      const serviceState = await Service.GetServiceState()
      if (!serviceState.running && state.network && state.networkConfig) {
        await Service.StartService({ network: state.network })
        dispatch({ type: 'START_SERVICE', port: state.networkConfig.port })
      }
    } catch (err) {
      logger.error(err)
    }
    dispatch({
      type: 'COMPLETE_ONBOARD'
    })
    onComplete()
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

      await Service.UpdateAppConfig({
        ...state.config,
        logLevel: '', // TODO: Fix this, what are permitted log levels
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
  networkConfig: Network
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

      const isSuccessful = await Service.SaveNetworkConfig(networkConfig)

      if (isSuccessful) {
        AppToaster.show({
          message: 'Configuration saved',
          intent: Intent.SUCCESS
        })
        dispatch({ type: 'UPDATE_NETWORK_CONFIG', config: networkConfig })
      } else {
        AppToaster.show({ message: 'Error: Unknown', intent: Intent.DANGER })
      }

      if (!state.network) {
        throw new Error('No network selected')
      }

      await Service.StartService({
        network: state.network
      })
      dispatch({ type: 'START_SERVICE', port: networkConfig.port })
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
      logger.error(err)
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
