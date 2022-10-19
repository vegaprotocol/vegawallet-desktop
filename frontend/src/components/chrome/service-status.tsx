import { useCallback } from 'react'

import { AppToaster } from '../toaster'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { Fonts } from '../../config/fonts'
import { ServiceState, useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'

function StatusCircle({
  background,
  loading
}: {
  background: string
  loading?: boolean
}) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    marginRight: 5,
    background
  }

  return (
    <span className={loading ? 'blink' : undefined} style={{ ...baseStyles }} />
  )
}

export function ServiceStatus() {
  const {
    service,
    dispatch,
    state: { network, networkConfig, serviceStatus }
  } = useGlobal()
  const serviceUrl = networkConfig
    ? `${networkConfig.host}:${networkConfig.port}`
    : ''

  const startService = useCallback(async () => {
    if (network) {
      dispatch({
        type: 'SET_SERVICE_STATUS',
        status: ServiceState.Loading
      })
      try {
        await service.StartService({ network })
      } catch (err) {
        dispatch({
          type: 'SET_SERVICE_STATUS',
          status: ServiceState.Error
        })
        AppToaster.show({
          intent: Intent.DANGER,
          message: `${err}`,
        })
      }
    }
  }, [dispatch, service, network])

  const restartService = useCallback(async () => {
    if (network) {
      try {
        await service.StopService()
      } catch (err) {
        dispatch({
          type: 'SET_SERVICE_STATUS',
          status: ServiceState.Error
        })
        AppToaster.show({
          intent: Intent.DANGER,
          message: `${err}`,
        })
      }

      await startService()
    }
  }, [startService, dispatch, service, network])

  switch (serviceStatus) {
    case ServiceState.Started: {
      return (
        <div data-testid='service-status' style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle background={Colors.VEGA_GREEN} />
          <>
            Wallet Service:{' '}
            <span
              style={{
                fontFamily: Fonts.MONO,
                background: Colors.DARK_GRAY_4,
                padding: '1px 5px'
              }}
            >
              {network}
            </span>{' '}
            on {serviceUrl}
          </>
        </div>
      )
    }
    case ServiceState.Stopped: {
      return (
        <div data-testid='service-status' style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle background={Colors.VEGA_RED} />
          <span>
            Wallet Service: Not running.{' '}
            <ButtonUnstyled onClick={startService}>Start</ButtonUnstyled>
          </span>
        </div>
      )
    }
    case ServiceState.Loading: {
      return (
        <div data-testid='service-status' style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle loading background={Colors.VEGA_ORANGE} />
          <span className='loading'>Wallet Service: Loading</span>
        </div>
      )
    }
    case ServiceState.Unhealthy: {
      return (
        <div data-testid="service-status" style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle loading background={Colors.VEGA_ORANGE} />
          <span>
            Wallet Service: Unhealthy{' '}
            <ButtonUnstyled onClick={restartService}>Restart</ButtonUnstyled>
          </span>
        </div>
      )
    }
    case ServiceState.Unreachable: {
      return (
        <div data-testid="service-status" style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle loading background={Colors.VEGA_ORANGE} />
          <span className='loading'>Wallet Service: Not reachable, retrying</span>
        </div>
      )
    }
    case ServiceState.Error: {
      return (
        <div data-testid="service-status" style={{ whiteSpace: 'nowrap' }}>
          <StatusCircle background={Colors.VEGA_RED} />
          <span>
            Wallet Service: Failed.{' '}
            <ButtonUnstyled onClick={startService}>Restart</ButtonUnstyled>
          </span>

        </div>
      )
    }
  }
}
