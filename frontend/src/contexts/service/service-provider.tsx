import React from 'react'
import { StartService, StopService } from '../../api/service'
import { useGlobal } from '../global/global-context'
import { startServiceAction } from './service-actions'
import { ServiceContext } from './service-context'
import { initialServiceState, serviceReducer } from './service-reducer'

interface ServiceProviderProps {
  children: React.ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  const {
    state: { network }
  } = useGlobal()

  const [state, dispatch] = React.useReducer(
    serviceReducer,
    initialServiceState
  )

  // Start service on app startup
  React.useEffect(() => {
    async function run() {
      if (!network) return

      try {
        // Always stop stop service so it can be started again with a new network
        await StopService()

        // Start service must be before API call because the below promise will only
        // resolve once the service is stopped
        dispatch(startServiceAction())

        // Only resolves once service is stoped
        await StartService({
          network,
          withConsole: false
        })
      } catch (err) {
        console.error(err)
      }
    }

    run()
  }, [network])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
