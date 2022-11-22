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
    // Version
    GetLatestRelease: Handlers.GetLatestRelease,
    GetVersion: Handlers.GetVersion,

    // Config
    GetAppConfig: Handlers.GetAppConfig,
    SearchForExistingConfiguration: Handlers.SearchForExistingConfiguration,
    UpdateAppConfig: (payload: AppConfig) => {
      return Handlers.UpdateAppConfig(new AppModel.Config(payload))
    },

    // Initialization
    InitialiseApp: Handlers.InitialiseApp,
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
    StartService: Handlers.StartService,
    StopService: Handlers.StopService,
    GetCurrentServiceInfo: Handlers.GetCurrentServiceInfo,

    // API
    EventsOn: EventsOn,
    EventsOff: EventsOff,
    RespondToInteraction: (payload: InteractionResponse) => {
      if ('data' in payload) {
        return Handlers.RespondToInteraction(payload)
      }
      return Handlers.RespondToInteraction({ ...payload, data: {} })
    }
  }
}
