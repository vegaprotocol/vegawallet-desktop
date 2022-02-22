import React from 'react'
import type { Thunk } from 'react-hook-thunk-reducer'

import type { Network } from '../../wailsjs/go/models'
import type { NetworkAction } from './network-reducer'

export enum ProxyName {
  Console = 'Console',
  TokenDApp = 'TokenDApp'
}

export interface ProxyApp {
  name: ProxyName
  running: boolean
  url: string
}

export interface NetworkPreset {
  name: string
  configFileUrl: string
  sha: string
}

export interface NetworkState {
  network: string | null
  networks: string[]
  presets: NetworkPreset[]
  config: Network | null
  serviceRunning: boolean
  serviceUrl: string
  console: ProxyApp
  tokenDapp: ProxyApp
}

export type NetworkDispatch = React.Dispatch<
  NetworkAction | Thunk<NetworkState, NetworkAction>
>

type NetworkContextShape = { state: NetworkState; dispatch: NetworkDispatch }

export const NetworkContext = React.createContext<
  NetworkContextShape | undefined
>(undefined)

export function useNetwork() {
  const context = React.useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useNetwork must be used within NetworkProvider')
  }
  return context
}
