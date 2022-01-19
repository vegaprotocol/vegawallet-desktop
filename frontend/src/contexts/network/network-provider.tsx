import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { useBackend } from '../backend/backend-context'
import { initNetworksAction } from './network-actions'
import { NetworkContext } from './network-context'
import { initialNetworkState, networkReducer } from './network-reducer'

interface NetworkProviderProps {
  children: React.ReactNode
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const service = useBackend()
  const [state, dispatch] = useThunkReducer(networkReducer, initialNetworkState)

  React.useEffect(() => {
    dispatch(initNetworksAction(service))
  }, [dispatch, service])

  return (
    <NetworkContext.Provider value={{ state, dispatch }}>
      {children}
    </NetworkContext.Provider>
  )
}
