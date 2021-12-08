import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { useNetwork } from '../network/network-context'
import { startServiceAction } from './service-actions'
import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const {
    state: { network }
  } = useNetwork()

  const [state, dispatch] = useThunkReducer(serviceReducer, initialServiceState)

  // Start service on app startup
  React.useEffect(() => {
    if (!network) return
    dispatch(startServiceAction(network))
  }, [network, dispatch])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
