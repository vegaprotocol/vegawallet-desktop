import type { InteractionResponse } from '@vegaprotocol/wallet-ui/src/types/interaction'
import type {
  AppConfig,
  Service
} from '@vegaprotocol/wallet-ui/src/types/service'

import { createLogger, initLogger } from '../lib/logging'
import * as Handlers from '../wailsjs/go/backend/Handler'
import { app as AppModel } from '../wailsjs/go/models'
import { EventsOff, EventsOn } from '../wailsjs/runtime'

const logger = createLogger('DesktopWallet')

export const useWalletService = (): Service => {
  return {
    TYPE: 'http',

    // Version
    GetLatestRelease: Handlers.GetLatestRelease,
    GetVersion: async () => {
      const { version, gitHash, backend, networksCompatibility } =
        await Handlers.GetVersion()

      return {
        version,
        gitHash,
        backend,
        networksCompatibility: networksCompatibility?.networksCompatibility
      }
    },

    // Config
    GetAppConfig: Handlers.GetAppConfig,
    SearchForExistingConfiguration: Handlers.SearchForExistingConfiguration,
    UpdateAppConfig: async (payload: AppConfig) => {
      Handlers.UpdateAppConfig(new AppModel.Config(payload))
      return undefined
    },

    // Initialization
    InitialiseApp: async ({ vegaHome }: { vegaHome : string }) => {
      await Handlers.InitialiseApp({ vegaHome })
      return undefined
    },
    IsAppInitialised: Handlers.IsAppInitialised,

    // Telemetry
    EnableTelemetry: async () => {
      initLogger()
      return undefined
    },

    // Logging
    GetLogger: (namespace?: string) => {
      if (namespace) {
        return createLogger(namespace)
      }
      return logger
    },

    // Service
    StartService: async ({ network }) => {
      await Handlers.StartService({ network, noVersionCheck: false })
      return undefined
    },
    StopService: async () => {
      await Handlers.StopService()
      return undefined
    },
    GetCurrentServiceInfo: Handlers.GetCurrentServiceInfo,

    // API
    EventsOn: EventsOn,
    EventsOff: EventsOff,
    RespondToInteraction: async (payload: InteractionResponse) => {
      if ('data' in payload) {
        await Handlers.RespondToInteraction(payload)
      }
      await Handlers.RespondToInteraction({ ...payload, data: {} })
      return undefined
    }
  }
}
