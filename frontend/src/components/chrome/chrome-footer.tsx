import React from 'react'
import { useGlobal } from '../../contexts/global/global-context'
import { useService } from '../../contexts/service/service-context'
import { ExternalLink } from '../external-link'

export function ChromeFooter() {
  const {
    state: { version }
  } = useGlobal()
  const {
    state: { serviceRunning, serviceUrl, consoleRunning, consoleUrl }
  } = useService()
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '10px 15px',
        fontSize: 14,
        background: 'url(./vega-bg.png)',
        backgroundSize: 'cover'
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <StatusCircle running={serviceRunning} />
          {serviceRunning ? (
            <>Service running: {serviceUrl}</>
          ) : (
            <>Service not running</>
          )}
        </div>
        <div>
          <StatusCircle running={consoleRunning} />
          {consoleRunning ? (
            <>
              Console running:{' '}
              <ExternalLink
                href={consoleUrl}
                style={{ textDecoration: 'underline' }}>
                {consoleUrl}
              </ExternalLink>
            </>
          ) : (
            <>Console not running</>
          )}
        </div>
      </div>
      <div>Version {version}</div>
    </footer>
  )
}

export function StatusCircle({ running }: any) {
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
