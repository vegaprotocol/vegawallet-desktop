import React from 'react'
import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const [state, dispatch] = React.useReducer(
    serviceReducer,
    initialServiceState
  )
  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
