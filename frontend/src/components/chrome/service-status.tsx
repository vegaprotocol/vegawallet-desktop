import { useCallback } from 'react'

import { Colors } from '../../config/colors'
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
      await service.StartService({ network })
    }
  }, [dispatch, service, network])

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
  }
}
