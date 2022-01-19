import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { useBackend } from '../backend/backend-context'
import { useNetwork } from '../network/network-context'
import { startServiceAction } from './service-actions'
import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const service = useBackend()
  const isFirstMount = React.useRef(true)
  const {
    state: { network, config }
  } = useNetwork()

  const [state, dispatch] = useThunkReducer(serviceReducer, initialServiceState)

  // Start service on app startup
  React.useEffect(() => {
    if (!isFirstMount.current || !network || !config) return
    dispatch(startServiceAction(network, config.Port, service))
    isFirstMount.current = false
  }, [network, config, dispatch, service])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
