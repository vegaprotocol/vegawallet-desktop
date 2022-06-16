import React from 'react'

import { Colors } from '../../config/colors'
import { Fonts } from '../../config/fonts'
import { useGlobal } from '../../contexts/global/global-context'
import { ExternalLink } from '../external-link'

export function ServiceStatus() {
  const {
    state: { network, serviceRunning, serviceUrl, console, tokenDapp }
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
      <div data-testid='dapp-status' style={{ whiteSpace: 'nowrap' }}>
        <>
          <StatusCircle running={console.running || tokenDapp.running} />
          {console.running || tokenDapp.running ? (
            <>
              DApps:{' '}
              {[console, tokenDapp]
                .filter(app => app.running)
                .map((app, i, arr) => {
                  return (
                    <span key={app.name}>
                      <ExternalLink href={app.url}>{app.name}</ExternalLink>
                      {i < arr.length - 1 ? ', ' : ''}
                    </span>
                  )
                })}
            </>
          ) : (
            <>DApp: None running</>
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
    marginRight: 5
  }
  const contextualStyles: React.CSSProperties = {
    background: running ? Colors.VEGA_GREEN : Colors.VEGA_RED
  }
  return <span style={{ ...baseStyles, ...contextualStyles }} />
}
