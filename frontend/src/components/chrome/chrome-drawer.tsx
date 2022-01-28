import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Colors } from '../../config/colors'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { useNetwork } from '../../contexts/network/network-context'
import { useService } from '../../contexts/service/service-context'
import { DropdownArrow } from '../icons/dropdown-arrow'

export function ChromeDrawer() {
  const { state, dispatch } = useGlobal()

  const collapsedHeight = 70
  const transform = state.drawerOpen
    ? 'translateY(0)'
    : `translateY(${window.innerHeight - collapsedHeight}px)`

  return (
    <div
      style={{
        background: Colors.DARK_GRAY_5,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform,
        transition: 'transform .15s ease',
        fontSize: 14
      }}>
      <div>
        <DrawerHead height={collapsedHeight} />
        {state.drawerOpen && <div>Content</div>}
      </div>
    </div>
  )
}

interface DrawerHeadProps {
  height: number
}

/** The part of the drawer that remains exposed */
function DrawerHead({ height }: DrawerHeadProps) {
  const {
    state: { serviceRunning, serviceUrl, proxy, proxyUrl }
  } = useService()
  const {
    state: { drawerOpen },
    dispatch: globalDispatch
  } = useGlobal()
  const {
    state: { network }
  } = useNetwork()
  return (
    <div
      style={{
        height,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0 10px 20px',
        borderBottom: `1px solid ${Colors.DARK_GRAY_3}`
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div>Network: {network ? network : 'None'}</div>
        <div>
          <StatusCircle running={serviceRunning} />
          {serviceRunning ? (
            <>Service running: {serviceUrl}</>
          ) : (
            <>Service not running</>
          )}
        </div>
      </div>
      <div>
        <ButtonUnstyled
          style={{ padding: 20 }}
          onClick={() => globalDispatch(setDrawerAction(!drawerOpen))}>
          <DropdownArrow
            style={{
              width: 16,
              height: 16,
              transform: drawerOpen ? '' : 'rotate(180deg)'
            }}
          />
        </ButtonUnstyled>
      </div>
    </div>
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
