import React from 'react'
import { StartService } from '../../api/service'
import { useGlobal } from '../global/global-context'
import { startServiceAction, stopServiceAction } from './service-actions'
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
        dispatch(startServiceAction())

        // StartService promise will only resolve once service is stoped
        await StartService({
          network,
          withConsole: false
        })

        dispatch(stopServiceAction())
      } catch (err) {
        console.error(err)
      }
    }

    run()
  }, [])

  return (
    <ServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ServiceContext.Provider>
  )
}
