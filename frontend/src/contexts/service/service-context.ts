import React from 'react'
import { Thunk } from 'react-hook-thunk-reducer'
import { ServiceAction } from './service-reducer'

export enum ProxyApp {
  None = 'None',
  Console = 'Console',
  TokenDApp = 'TokenDApp'
}

export interface ServiceState {
  serviceRunning: boolean
  serviceUrl: string
  proxy: ProxyApp
  proxyUrl: string
}

export type ServiceDispatch = React.Dispatch<
  ServiceAction | Thunk<ServiceState, ServiceAction>
>

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
