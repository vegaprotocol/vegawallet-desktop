import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { useNetwork } from '../network/network-context'
import { startServiceAction, stopServiceAction } from './service-actions'
import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const {
    state: { network, config }
  } = useNetwork()

  const [state, dispatch] = useThunkReducer(serviceReducer, initialServiceState)

  // Start service on app startup
  React.useEffect(() => {
    if (!network || !config) return
    dispatch(startServiceAction(network, config.Port))
  }, [network, config, dispatch])

  // Stop services any time user updates their network config, otherwise you
  // might get in a pickle where services are running on ports when the config
  // has been changed to use different ports
  React.useEffect(() => {
    dispatch(stopServiceAction())
  }, [config, dispatch])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
