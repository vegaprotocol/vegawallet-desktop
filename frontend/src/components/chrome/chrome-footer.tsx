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
        {serviceRunning ? (
          <div>Service running: {serviceUrl}</div>
        ) : (
          <div>Service not running</div>
        )}
        {consoleRunning ? (
          <div>
            Console running:{' '}
            <ExternalLink
              href={consoleUrl}
              style={{ textDecoration: 'underline' }}>
              {consoleUrl}
            </ExternalLink>
          </div>
        ) : (
          <div>Console not running</div>
        )}
      </div>
      <div>Version {version}</div>
    </footer>
  )
}
