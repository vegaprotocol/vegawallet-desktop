import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import log from 'loglevel'

import { Service } from '../../service';
import { GlobalContext } from './global-context'
import { globalReducer, initialGlobalState } from './global-reducer'
import { createActions } from './global-actions';

interface GlobalProviderProps {
  service: typeof Service;
  logger: log.Logger;
  enableTelemetry: () => void;
  children: React.ReactElement
}

export function GlobalProvider({ service, logger, enableTelemetry, children }: GlobalProviderProps) {
  const [state, dispatch] = useThunkReducer(globalReducer, initialGlobalState)
  const actions = createActions(service, logger, enableTelemetry);

  return (
    <GlobalContext.Provider value={{ state, actions, logger, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
