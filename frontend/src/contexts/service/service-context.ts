import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type { ServiceAction } from './service-reducer'

export enum ProxyName {
  Console = 'Console',
  TokenDApp = 'TokenDApp'
}

export interface ProxyApp {
  name: ProxyName
  running: boolean
  url: string
}

export interface ServiceState {
  serviceRunning: boolean
  serviceUrl: string
  console: ProxyApp
  tokenDapp: ProxyApp
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
