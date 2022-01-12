import React from 'react'
import { Thunk } from 'react-hook-thunk-reducer'
import { Network } from '../../models/network'
import { NetworkAction } from './network-reducer'

export interface NetworkState {
  network: string | null
  networks: string[]
  config: Network | null
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