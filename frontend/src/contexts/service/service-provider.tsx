import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'

import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [state, dispatch] = useThunkReducer(serviceReducer, initialServiceState)

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
