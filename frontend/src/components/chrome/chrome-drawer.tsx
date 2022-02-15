import React from 'react'

import { APP_FRAME_HEIGHT } from '../../app'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { usePrevious } from '../../hooks/use-previous'
import { useWindowSize } from '../../hooks/use-window-size'
import { DRAWER_HEIGHT } from '.'
import { DrawerContent } from './drawer-content'
import { DrawerHead } from './drawer-head'
import { ServiceStatus } from './service-status'

/**
 * Renders and controls the slide up drawer showing network information.
 */
export function ChromeDrawer() {
  const { state } = useGlobal()
  const { height } = useWindowSize()
  const prevDrawerState = usePrevious(state.drawerOpen)

  // Move the drawer up to full screen if open, otherwise 'minimise' only showing the top DRAWER_HEIGHTpx
  const transform = state.drawerOpen
    ? `translateY(-${height - APP_FRAME_HEIGHT}px)` // Use app frame height to avoid drawer slipping behind the close/minimize buttons of the application
    : `translateY(-${DRAWER_HEIGHT}px)`

  // Only apply the transition animation if the drawer is opening or closing, this way resizing
  // the window instantly renders the drawer in the correct position
  const transition =
    prevDrawerState !== state.drawerOpen ? 'transform .5s ease' : undefined

  return (
    <div
      className='vega-border-image'
      style={{
        background: Colors.BLACK,
        position: 'fixed',
        top: '100%',
        left: 0,
        width: '100%',
        height: height - APP_FRAME_HEIGHT,
        transform,
        transition,
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
