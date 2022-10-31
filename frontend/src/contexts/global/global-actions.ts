import type log from 'loglevel'

import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { DataSources } from '../../config/data-sources'
import { Intent } from '../../config/intent'
import type { NetworkPreset } from '../../lib/networks'
import { fetchNetworkPreset } from '../../lib/networks'
import type { ServiceType } from '../../service'
import { config as ConfigModel } from '../../wailsjs/go/models'
import type { WalletModel } from '../../wallet-client'
import type { GlobalDispatch, GlobalState } from './global-context'
import { DrawerPanel, ServiceState } from './global-context'
import type { GlobalAction } from './global-reducer'

type ServiceAction = {
  logger: log.Logger
  getState: () => GlobalState
  service: ServiceType
  dispatch: GlobalDispatch
}

const stopService = async ({ logger, service, dispatch }: ServiceAction) => {
  logger.debug('StopService')
  try {
    const status = await service.GetServiceState()
    if (status.running) {
      await service.StopService()
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Stopped
      })
    }
  } catch (err) {
    dispatch({
      type: 'SET_SERVICE_STATUS',
      status: ServiceState.Error
    })
    logger.error(err)
    AppToaster.show({
      message: `${err}`,
      intent: Intent.DANGER
    })
  }
}

const startService = async ({
  logger,
  getState,
  service,
  dispatch
}: ServiceAction) => {
  logger.debug('StartService')
  const state = getState()
  try {
    const status = await service.GetServiceState()
    if (!status.running && state.network && state.networkConfig) {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Loading
      })
      await service.StartService({ network: state.network })
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Started
      })
    }
  } catch (err) {
    logger.error(err)
    dispatch({
      type: 'SET_SERVICE_STATUS',
      status: ServiceState.Error
    })
    AppToaster.show({
      message: `${err}`,
      intent: Intent.DANGER
    })
  }
}

const getNetworks = async (service: ServiceType, preset?: NetworkPreset) => {
  const networks = await service.WalletApi.ListNetworks()

  if (preset && (!networks.networks || networks.networks.length === 0)) {
    await service.WalletApi.ImportNetwork({
      name: preset.name,
      url: preset.configFileUrl,
      filePath: '',
      overwrite: true
    })

    return service.WalletApi.ListNetworks()
  }

  return networks
}

const getDefaultNetwork = (
  config: ConfigModel.Config,
  networks: WalletModel.ListNetworksResult
) => {
  if (config.defaultNetwork) {
    return config.defaultNetwork
  }
  return networks.networks?.[0]
}

export function createActions(
  service: ServiceType,
  logger: log.Logger,
  enableTelemetry: () => void
) {
  const actions = {
    initAppAction() {
      return async (dispatch: GlobalDispatch) => {
        try {
          const config = await service.GetAppConfig()

          if (config.telemetry.enabled) {
            enableTelemetry()
          }

          logger.debug('StartApp')

          const [isInit, version, presets, presetsInternal] = await Promise.all(
            [
              service.IsAppInitialised(),
              service.GetVersion(),
              fetchNetworkPreset(DataSources.NETWORKS, logger),
              fetchNetworkPreset(DataSources.NETWORKS_INTERNAL, logger)
            ]
          )

          dispatch({ type: 'SET_VERSION', version })
          dispatch({ type: 'SET_PRESETS', presets })
          dispatch({ type: 'SET_PRESETS_INTERNAL', presets: presetsInternal })

          if (!isInit) {
            const existingConfig =
              await service.SearchForExistingConfiguration()
            dispatch({ type: 'START_ONBOARDING', existing: existingConfig })
            return
          }

          // else continue with app setup, get wallets/networks
          logger.debug('InitApp')

          // should now have an app config
          const [wallets, networks]: [
            WalletModel.ListWalletsResult,
            WalletModel.ListNetworksResult
          ] = await Promise.all([
            service.WalletApi.ListWallets(),
            getNetworks(service, presets[0])
          ])

          const defaultNetwork = getDefaultNetwork(config, networks)

          const defaultNetworkConfig = defaultNetwork
            ? await service.WalletApi.DescribeNetwork({
                network: defaultNetwork
              })
            : null

          dispatch({
            type: 'INIT_APP',
            config: config,
            wallets: wallets.wallets ?? [],
            network: defaultNetwork ?? '',
            networks: networks.networks ?? [],
            networkConfig: defaultNetworkConfig,
            presetNetworks: presets,
            presetNetworksInternal: presetsInternal
          })
        } catch (err) {
          dispatch({ type: 'INIT_APP_FAILED' })
          logger.error(err)
        }
      }
    },

    updateTelemetry(telemetry: { enabled: boolean; consentAsked: boolean }) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        if (telemetry.enabled) {
          enableTelemetry()
        }

        logger.debug('UpdateTelemetry')
        try {
          const { config } = getState()
          if (config) {
            const newConfig = new ConfigModel.Config({ ...config, telemetry })
            await service.UpdateAppConfig(newConfig)
            dispatch({
              type: 'SET_CONFIG',
              config: newConfig
            })
          }
        } catch (err) {
          AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
          logger.error(err)
        }
      }
    },

    completeOnboardAction(onComplete: () => void) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        await startService({
          getState,
          logger,
          dispatch,
          service
        })
        dispatch({
          type: 'COMPLETE_ONBOARD'
        })
        onComplete()
      }
    },

    addWalletAction(
      wallet: string,
      key: WalletModel.DescribeKeyResult
    ): GlobalAction {
      return { type: 'ADD_WALLET', wallet, key }
    },

    addKeypairAction(wallet: string) {
      return async (dispatch: GlobalDispatch) => {
        logger.debug('AddKeyPair')
        try {
          const passphrase = await requestPassphrase()
          const res = await service.WalletApi.GenerateKey({
            wallet,
            passphrase,
            metadata: []
          })

          const keypair = await service.WalletApi.DescribeKey({
            wallet,
            passphrase,
            publicKey: res.publicKey ?? ''
          })

          dispatch({
            type: 'ADD_KEYPAIR',
            wallet,
            keypair
          })
        } catch (err) {
          if (err !== 'dismissed') {
            AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
            logger.error(err)
          }
        }
      }
    },

    updateKeyPairAction(
      wallet: string,
      keypair: WalletModel.DescribeKeyResult
    ): GlobalAction {
      return { type: 'UPDATE_KEYPAIR', wallet, keypair }
    },

    setDrawerAction(
      isOpen: boolean,
      panel?: DrawerPanel | null,
      editingNetwork?: string
    ): GlobalAction {
      return {
        type: 'SET_DRAWER',
        state: {
          isOpen,
          panel: panel ?? DrawerPanel.Network,
          editingNetwork: editingNetwork ?? null
        }
      }
    },

    setPassphraseModalAction(open: boolean): GlobalAction {
      return { type: 'SET_PASSPHRASE_MODAL', open }
    },

    changeWalletAction(wallet: string): GlobalAction {
      return {
        type: 'CHANGE_WALLET',
        wallet
      }
    },

    deactivateWalletAction(wallet: string): GlobalAction {
      return {
        type: 'DEACTIVATE_WALLET',
        wallet
      }
    },

    // Network actions

    changeNetworkAction(network: string) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        logger.debug('ChangeNetwork')
        const state = getState()

        try {
          await stopService({
            getState,
            logger,
            dispatch,
            service
          })

          await service.UpdateAppConfig(
            new ConfigModel.Config({
              ...state.config,
              defaultNetwork: network
            })
          )

          const config = await service.WalletApi.DescribeNetwork({ network })

          dispatch({
            type: 'CHANGE_NETWORK',
            network,
            config
          })

          await stopService({
            getState,
            logger,
            dispatch,
            service
          })
        } catch (err) {
          AppToaster.show({
            message: `${err}`,
            intent: Intent.DANGER
          })
          logger.error(err)
        }
      }
    },

    updateNetworkConfigAction(
      editingNetwork: string,
      networkConfig: WalletModel.DescribeNetworkResult
    ) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()

        logger.debug('UpdateNetworkConfig')

        // Stop main REST service if you are editing the active network config
        if (state.network === editingNetwork) {
          await stopService({
            getState,
            logger,
            dispatch,
            service
          })
        }

        try {
          const isSuccessful = await service.WalletApi.UpdateNetwork(
            networkConfig
          )

          if (isSuccessful) {
            AppToaster.show({
              message: 'Configuration saved',
              intent: Intent.SUCCESS
            })

            const updatedNetwork = await service.WalletApi.DescribeNetwork({
              network: networkConfig.name
            })

            dispatch({ type: 'UPDATE_NETWORK_CONFIG', config: updatedNetwork })
          } else {
            AppToaster.show({
              message: 'Error: Failed updating network configuration.',
              intent: Intent.DANGER
            })
          }
        } catch (err) {
          AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
          logger.error(err)
        }

        if (state.network === editingNetwork) {
          await startService({
            getState,
            logger,
            dispatch,
            service
          })
        }
      }
    },

    addNetworkAction(
      network: string,
      config: WalletModel.DescribeNetworkResult
    ) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()

        dispatch({
          type: 'ADD_NETWORK',
          network,
          config
        })

        if (!state.network) {
          dispatch(actions.changeNetworkAction(network))
        }
      }
    },

    removeNetwork(network: string) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()
        logger.debug('RemoveNetwork')
        try {
          if (state.network === network) {
            await stopService({
              getState,
              logger,
              dispatch,
              service
            })
          }
          await service.WalletApi.RemoveNetwork({ network })
          dispatch({
            type: 'REMOVE_NETWORK',
            network
          })
          AppToaster.show({
            message: `Successfully removed network "${network}".`,
            intent: Intent.SUCCESS
          })
        } catch (err) {
          logger.error(err)
          AppToaster.show({
            message: `Error removing network "${network}".`,
            intent: Intent.DANGER
          })
        }
      }
    },

    startServiceAction() {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        await startService({
          logger,
          getState,
          service,
          dispatch
        })
      }
    },

    stopServiceAction() {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        await stopService({
          logger,
          getState,
          service,
          dispatch
        })
      }
    }
  }

  return actions
}

export type GlobalActions = ReturnType<typeof createActions>
