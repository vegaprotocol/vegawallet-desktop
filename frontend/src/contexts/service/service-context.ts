import React from 'react'
import { ServiceAction } from './service-reducer'

export interface ServiceState {
  running: boolean
  url: string | null
}

export type ServiceDispatch = React.Dispatch<ServiceAction>

type ServiceContextShape = { state: ServiceState; dispatch: ServiceDispatch }

export const ServiceContext = React.createContext<
  ServiceContextShape | undefined
>(undefined)

export function useService() {
  const context = React.useContext(ServiceContext)
  if (context === undefined) {
    throw new Error('useService must be used within ServiceProvider')
  }
  return context
}
