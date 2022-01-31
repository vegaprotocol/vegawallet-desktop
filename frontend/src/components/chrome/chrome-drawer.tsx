import React from 'react'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { DRAWER_HEIGHT } from '.'
import { ServiceStatus } from './service-status'
import { DrawerHead } from './drawer-head'
import { DrawerContent } from './drawer-content'

/**
 * Renders and controls the slide up drawer showing network information.
 */
export function ChromeDrawer() {
  const { state } = useGlobal()

  const transform = state.drawerOpen
    ? 'translateY(0)'
    : `translateY(${window.innerHeight - DRAWER_HEIGHT}px)`

  return (
    <div
      style={{
        background: Colors.DARK_GRAY_1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform,
        transition: 'transform .15s ease',
        fontSize: 14,
        overflowY: 'auto'
      }}>
      {state.drawerOpen ? (
        <DrawerContent />
      ) : (
        <DrawerHead height={DRAWER_HEIGHT}>
          <ServiceStatus />
        </DrawerHead>
      )}
    </div>
  )
}
