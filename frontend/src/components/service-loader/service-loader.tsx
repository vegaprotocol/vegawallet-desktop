import { useEffect, useState } from 'react'

import { Intent } from '../../config/intent'
import {
  DrawerPanel,
  ServiceState,
  useGlobal
} from '../../contexts/global/global-context'
import { useCheckForUpdate } from '../../hooks/use-check-for-update'
import { EVENTS } from '../../lib/events'
import {
  EventsOff,
  EventsOn,
  WindowReload
} from '../../wailsjs/runtime/runtime'
import { Button } from '../button'
import { SplashError } from '../splash-error'
import { AppToaster } from '../toaster'

/**
 * Initialiases the app
 */
export function ServiceLoader({ children }: { children: React.ReactNode }) {
  const [serviceError, setServiceError] = useState<string | null>(null)
  useCheckForUpdate()

  const {
    state: { serviceStatus, network, networkConfig },
    service,
    dispatch
  } = useGlobal()

  useEffect(() => {
    EventsOn(EVENTS.SERVICE_HEALTHY, () => {
      setServiceError(null)
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Started
      })
    })

    EventsOn(EVENTS.SERVICE_UNREACHABLE, () => {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Loading
      })
    })

    EventsOn(EVENTS.SERVICE_UNHEALTHY, () => {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Loading
      })
    })

    EventsOn(EVENTS.SERVICE_STOPPED_WITH_ERROR, (err: Error) => {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Stopped
      })

      AppToaster.show({
        intent: Intent.DANGER,
        message: `${err}`
      })
    })

    EventsOn(EVENTS.SERVICE_STOPPED, () => {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Stopped
      })
    })

    return () => {
      EventsOff(
        EVENTS.SERVICE_HEALTHY,
        EVENTS.SERVICE_UNREACHABLE,
        EVENTS.SERVICE_UNHEALTHY,
        EVENTS.SERVICE_STOPPED_WITH_ERROR,
        EVENTS.SERVICE_STOPPED
      )
    }
  }, [dispatch])

  useEffect(() => {
    async function start() {
      if (network && networkConfig && serviceStatus === ServiceState.Stopped) {
        try {
          dispatch({
            type: 'SET_SERVICE_STATUS',
            status: ServiceState.Loading
          })
          const { running } = await service.GetServiceState()
          if (!running) {
            await service.StartService({ network })
          }
        } catch (err) {
          setServiceError(`${err}`)
        }
      }
    }

    start()
  }, [service, dispatch, network, networkConfig, serviceStatus])

  if (serviceError && networkConfig) {
    return (
      <SplashError
        title='Wallet service cannot load'
        message={
          <span>
            There is an application already running on your machine on port{' '}
            <strong>:{networkConfig.port}</strong>, which is preventing this
            application from loading. Close the application, or change your
            network port.
          </span>
        }
        actions={
          <>
            <Button onClick={() => WindowReload()}>Reload</Button>
            <Button
              onClick={() =>
                dispatch({
                  type: 'SET_DRAWER',
                  state: {
                    isOpen: true,
                    panel: DrawerPanel.Edit,
                    editingNetwork: network
                  }
                })
              }
            >
              Change port
            </Button>
          </>
        }
      />
    )
  }

  return <>{children}</>
}
