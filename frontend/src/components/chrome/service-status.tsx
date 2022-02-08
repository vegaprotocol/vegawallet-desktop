import React from 'react'
import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import { useNetwork } from '../../contexts/network/network-context'
import { ProxyApp, useService } from '../../contexts/service/service-context'
import { ExternalLink } from '../external-link'

export function ServiceStatus() {
  const {
    state: { serviceRunning, serviceUrl, proxy, proxyUrl }
  } = useService()
  const {
    state: { network }
  } = useNetwork()
  return (
    <>
      <div>
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
      <div>
        <>
          <StatusCircle running={proxy !== ProxyApp.None} />
          {proxy !== ProxyApp.None ? (
            <>
              DApp: {proxy} on{' '}
              <ExternalLink href={proxyUrl}>{proxyUrl}</ExternalLink>
            </>
          ) : (
            <>DApp: Not running</>
          )}
        </>
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
    border: '2px solid white',
    marginRight: 5
  }
  const contextualStyles: React.CSSProperties = {
    background: running ? 'white' : 'transparent'
  }
  return <span style={{ ...baseStyles, ...contextualStyles }} />
}
