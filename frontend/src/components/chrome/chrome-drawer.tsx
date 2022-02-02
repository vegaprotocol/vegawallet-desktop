import React from 'react'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { DRAWER_HEIGHT } from '.'
import { ServiceStatus } from './service-status'
import { DrawerHead } from './drawer-head'
import { DrawerContent } from './drawer-content'
import { usePrevious } from '../../hooks/use-previous'
import { useWindowSize } from '../../hooks/use-window-size'

/**
 * Renders and controls the slide up drawer showing network information.
 */
export function ChromeDrawer() {
  const { state } = useGlobal()
  const { height } = useWindowSize()
  const prevDrawerState = usePrevious(state.drawerOpen)

  // Move the drawer up to full screen if open, otherwise 'minimise' only showing the top DRAWER_HEIGHTpx
  const transform = state.drawerOpen
    ? 'translateY(0)'
    : `translateY(${height - DRAWER_HEIGHT}px)`

  // Only apply the transition animation if the drawer is opening or closing, this way resizing
  // the window instantly renders the drawer in the correct position
  const transition =
    prevDrawerState !== state.drawerOpen ? 'transform .2s ease' : undefined

  return (
    <div
      className='vega-border-image'
      style={{
        background: Colors.DARK_GRAY_1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform,
        transition,
        fontSize: 14,
        overflowY: 'auto',
        borderTop: '3px solid'
      }}
    >
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
