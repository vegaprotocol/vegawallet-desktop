import type log from 'loglevel'
import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'

import type { ServiceType } from '../../service'
import { createActions } from './global-actions'
import { GlobalContext } from './global-context'
import { globalReducer, initialGlobalState } from './global-reducer'

interface GlobalProviderProps {
  service: ServiceType
  logger: log.Logger
  enableTelemetry: () => void
  children: React.ReactElement
}

export function GlobalProvider({
  service,
  logger,
  enableTelemetry,
  children
}: GlobalProviderProps) {
  const [state, dispatch] = useThunkReducer(globalReducer, initialGlobalState)
  const actions = React.useMemo(
    () => createActions(service, logger, enableTelemetry),
    [service, logger, enableTelemetry]
  )

  return (
    <GlobalContext.Provider
      value={{ state, actions, service, logger, dispatch }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
