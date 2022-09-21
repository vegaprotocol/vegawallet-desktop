import type log from 'loglevel'

import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { DataSources } from '../../config/data-sources'
import { Intent } from '../../config/intent'
import type { ServiceType } from '../../service'
import {
  config as ConfigModel,
  network as NetworkModel,
} from '../../wailsjs/go/models'
import { WalletModel } from '../../wallet-client';
import type { GlobalDispatch, GlobalState } from './global-context'
import type { GlobalAction } from './global-reducer'

export function createActions(
  service: ServiceType,
  logger: log.Logger,
  enableTelemetry: () => void
) {
  return {
    initAppAction() {
      return async (dispatch: GlobalDispatch) => {
        try {
          const config = await service.GetAppConfig()

          if (config.telemetry.enabled) {
            enableTelemetry()
          }

          logger.debug('StartApp')

          const [isInit, version, presets] = await Promise.all([
            service.IsAppInitialised(),
            service.GetVersion(),
            fetch(DataSources.NETWORKS).then(res => res.json())
          ])

          dispatch({ type: 'SET_VERSION', version: version.version })
          dispatch({ type: 'SET_PRESETS', presets })

          if (!isInit) {
            const existingConfig =
              await service.SearchForExistingConfiguration()
            dispatch({ type: 'START_ONBOARDING', existing: existingConfig })
            return
          }

          // else continue with app setup, get wallets/networks
          logger.debug('InitApp')

          // should now have an app config
          const [wallets, networks] = await Promise.all([
            service.WalletApi.ListWallets(),
            service.WalletApi.ListNetworks(),
          ])

          const defaultNetwork = config.defaultNetwork
            ? networks.find(n => n === config.defaultNetwork) ||
              networks[0]
            : networks[0]

          const defaultNetworkConfig = defaultNetwork
            ? await service.GetNetworkConfig(defaultNetwork)
            : null

          const serviceState = await service.GetServiceState()

          dispatch({
            type: 'INIT_APP',
            isInit: true,
            config: config,
            wallets: wallets,
            network: defaultNetwork,
            networks: networks,
            networkConfig: defaultNetworkConfig,
            presetNetworks: presets,
            serviceRunning: serviceState.running
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
        const state = getState()
        try {
          const serviceState = await service.GetServiceState()
          if (!serviceState.running && state.network && state.networkConfig) {
            await service.StartService({ network: state.network })
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
    },

    addWalletAction(
      wallet: string,
      key: WalletModel.DescribeKeyResponse
    ): GlobalAction {
      return { type: 'ADD_WALLET', wallet, key }
    },

    addKeypairAction(wallet: string) {
      return async (dispatch: GlobalDispatch) => {
        logger.debug('AddKeyPair')
        try {
          const passphrase = await requestPassphrase()
          const res = await service.WalletApi.GenerateKey(wallet, passphrase, {});

          const keypair = await service.WalletApi.DescribeKey(
            wallet,
            passphrase,
            res.publicKey ?? '',
          )

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

    getKeysAction(wallet: string) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()
        const selectedWallet = state.wallets.find(w => w.name === wallet)

        if (selectedWallet?.keypairs) {
          dispatch({ type: 'ACTIVATE_WALLET', wallet })
          const publicKey = Object.keys(selectedWallet.keypairs)[0]
          window.location.hash = `/wallet/${wallet}/keypair/${publicKey}`
          logger.debug('ChangeWallet')
        } else {
          try {
            const passphrase = await requestPassphrase()
            const keys = await service.WalletApi.ListKeys(wallet, passphrase);

            const keysWithMeta = await Promise.all(
              (keys.keys || []).map(key =>
                service.WalletApi.DescribeKey(
                  wallet,
                  passphrase,
                  key.public_key ?? '',
                )
              )
            )

            dispatch({
              type: 'SET_KEYPAIRS',
              wallet,
              keypairs: keysWithMeta || []
            })

            if (keys.keys?.length) {
              window.location.hash = `/wallet/${wallet}/keypair/${keys.keys[0].publicKey}`
            } else {
              window.location.hash = `/wallet/${wallet}`
            }
          } catch (err) {
            if (err !== 'dismissed') {
              AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
              logger.error(err)
            }
          }
        }
      }
    },

    updateKeyPairAction(
      wallet: string,
      keypair: WalletModel.DescribeKeyResponse
    ): GlobalAction {
      return { type: 'UPDATE_KEYPAIR', wallet, keypair }
    },

    setPassphraseModalAction(open: boolean): GlobalAction {
      return { type: 'SET_PASSPHRASE_MODAL', open }
    },

    setDrawerAction(open: boolean): GlobalAction {
      return { type: 'SET_DRAWER', open }
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

        try {
          const state = getState()
          await service.UpdateAppConfig(
            new ConfigModel.Config({
              ...state.config,
              defaultNetwork: network
            })
          )

          const config = await service.GetNetworkConfig(network)

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
    },

    updateNetworkConfigAction(
      editingNetwork: string,
      networkConfig: NetworkModel.Network
    ) {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()

        logger.debug('UpdateNetworkConfig')

        try {
          // Stop main REST service if you are editing the active network config
          if (state.network === editingNetwork) {
            const serviceStatus = await service.GetServiceState()
            if (serviceStatus.running) {
              await service.StopService()
            }
          }

          const isSuccessful = await service.SaveNetworkConfig(networkConfig)

          if (isSuccessful) {
            AppToaster.show({
              message: 'Configuration saved',
              intent: Intent.SUCCESS
            })
            dispatch({ type: 'UPDATE_NETWORK_CONFIG', config: networkConfig })
          } else {
            AppToaster.show({
              message: 'Error: Unknown',
              intent: Intent.DANGER
            })
          }

          if (!state.network) {
            throw new Error('No network selected')
          }

          await service.StartService({
            network: state.network
          })
          dispatch({ type: 'START_SERVICE', port: networkConfig.port })
        } catch (err) {
          AppToaster.show({ message: `${err}`, intent: Intent.DANGER })
          logger.error(err)
        }
      }
    },

    addNetworkAction(network: string, config: NetworkModel.Network) {
      return async (dispatch: GlobalDispatch) => {
        // If no service running start service for newly added network
        try {
          const status = await service.GetServiceState()
          if (!status.running) {
            await service.StartService({ network })
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
    },

    startServiceAction() {
      return async (dispatch: GlobalDispatch, getState: () => GlobalState) => {
        const state = getState()
        logger.debug('StartService')
        try {
          const status = await service.GetServiceState()
          if (!status.running && state.network && state.networkConfig) {
            await service.StartService({ network: state.network })
            dispatch({ type: 'START_SERVICE', port: state.networkConfig.port })
          }
        } catch (err) {
          logger.error(err)
        }
      }
    },

    stopServiceAction() {
      return async (dispatch: GlobalDispatch) => {
        logger.debug('StopService')
        try {
          const status = await service.GetServiceState()
          if (status.running) {
            await service.StopService()
            dispatch({ type: 'STOP_SERVICE' })
          }
        } catch (err) {
          logger.error(err)
        }
      }
    }
  }
}

export type GlobalActions = ReturnType<typeof createActions>
