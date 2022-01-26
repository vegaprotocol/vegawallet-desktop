import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
import { ProxyApp, useService } from '../../contexts/service/service-context'
import { ExternalLink } from '../external-link'
// @ts-ignore
import vegaBg from '../../images/vega-bg.png'

export function ChromeFooter() {
  const {
    state: { network }
  } = useNetwork()
  const {
    state: { serviceRunning, serviceUrl, proxy, proxyUrl }
  } = useService()
  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '10px 15px',
        background: `url(${vegaBg})`,
        backgroundSize: 'cover',
        fontSize: 14
      }}>
      <FooterCol>
        <div>
          <StatusCircle running={serviceRunning} />
          {serviceRunning ? (
            <>Service running: {serviceUrl}</>
          ) : (
            <>Service not running</>
          )}
        </div>
        <div>
          <>
            <StatusCircle running={proxy !== ProxyApp.None} />
            {proxy !== ProxyApp.None ? (
              <>
                dApp running:{' '}
                <ExternalLink
                  href={proxyUrl}
                  style={{ textDecoration: 'underline' }}>
                  {proxy} @ {proxyUrl}
                </ExternalLink>
              </>
            ) : (
              <>dApp not running</>
            )}
          </>
        </div>
      </FooterCol>
      <FooterCol>
        <div>Network: {network ? network : 'None'}</div>
      </FooterCol>
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

function FooterCol({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {children}
    </div>
  )
}
