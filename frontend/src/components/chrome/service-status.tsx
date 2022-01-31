import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
import { useService } from '../../contexts/service/service-context'

export function ServiceStatus() {
  const {
    state: { serviceRunning, serviceUrl }
  } = useService()
  const {
    state: { network }
  } = useNetwork()
  return (
    <>
      <div>Network: {network ? network : 'None'}</div>
      <div>
        <StatusCircle running={serviceRunning} />
        {serviceRunning ? (
          <>Service running: {serviceUrl}</>
        ) : (
          <>Service not running</>
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
    border: '2px solid white',
    marginRight: 5
  }
  const contextualStyles: React.CSSProperties = {
    background: running ? 'white' : 'transparent'
  }
  return <span style={{ ...baseStyles, ...contextualStyles }} />
}
