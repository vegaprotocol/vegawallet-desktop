import React from 'react'
import { useGlobal } from '../../contexts/global/global-context'
import { useService } from '../../contexts/service/service-context'
import { ExternalLink } from '../external-link'

export function ChromeFooter() {
  const {
    state: { version }
  } = useGlobal()
  const {
    state: { url, running }
  } = useService()
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        fontSize: 14,
        background: 'url(./vega-bg.png)',
        backgroundSize: 'cover'
      }}>
      <div>Version {version}</div>
      {running ? (
        <>
          {url ? (
            <div>
              Console running @ <ExternalLink href={url}>{url}</ExternalLink>
            </div>
          ) : (
            <div>Service running</div>
          )}
        </>
      ) : (
        <div>Service not running</div>
      )}
    </footer>
  )
}
