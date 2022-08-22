import React from 'react'

import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import { useGlobal } from '../../contexts/global/global-context'

export function ServiceStatus() {
  const {
    state: { network, serviceRunning, serviceUrl }
  } = useGlobal()

  return (
    <>
      <div data-testid='service-status' style={{ whiteSpace: 'nowrap' }}>
        <StatusCircle running={serviceRunning} />
        {serviceRunning ? (
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
        ) : (
          <>Wallet Service: Not running</>
        )}
      </div>
    </>
  )
}

function StatusCircle({ running }: any) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    marginRight: 5
  }
  const contextualStyles: React.CSSProperties = {
    background: running ? Colors.VEGA_GREEN : Colors.VEGA_RED
  }
  return <span style={{ ...baseStyles, ...contextualStyles }} />
}
