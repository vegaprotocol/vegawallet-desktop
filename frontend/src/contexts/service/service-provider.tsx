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
  const isFirstMount = React.useRef(true)
  const {
    state: { network, config }
  } = useNetwork()

  const [state, dispatch] = useThunkReducer(serviceReducer, initialServiceState)

  // Start service on app startup
  React.useEffect(() => {
    if (!isFirstMount.current || !network || !config) return
    dispatch(startServiceAction(network, config.Port))
    isFirstMount.current = false
  }, [network, config, dispatch])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
