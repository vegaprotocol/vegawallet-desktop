import React from 'react'
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
      <div data-testid='service-status'>
        <StatusCircle running={serviceRunning} />
        {serviceRunning ? (
          <>
            Connected to {network} on {serviceUrl}
          </>
        ) : (
          <>Service not running</>
        )}
      </div>
      <div data-testid='dapp-status'>
        <>
          <StatusCircle running={proxy !== ProxyApp.None} />
          {proxy !== ProxyApp.None ? (
            <>
              dApp running:{' '}
              <ExternalLink href={proxyUrl}>
                {proxy} @ {proxyUrl}
              </ExternalLink>
            </>
          ) : (
            <>dApp not running</>
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
