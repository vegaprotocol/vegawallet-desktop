import { animated, config, useSpring } from 'react-spring'

import { APP_FRAME_HEIGHT } from '../../app'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { DRAWER_HEIGHT } from '.'
import { DrawerContent } from './drawer-content'

interface ChromeDrawerProps {
  height: number
}

/**
 * Renders and controls the slide up drawer showing network information.
 */
export function ChromeDrawer({ height }: ChromeDrawerProps) {
  const { state } = useGlobal()
  const styles = useSpring({
    to: {
      y: state.drawerOpen ? -(height - APP_FRAME_HEIGHT - DRAWER_HEIGHT) : 0
    },
    config: { ...config.default, duration: 170 }
  })

  return (
    <animated.div
      className='vega-border-image'
      style={{
        translateY: styles.y,
        background: Colors.BLACK,
        borderTop: '3px solid',
        height: height - APP_FRAME_HEIGHT,
        overflowY: state.drawerOpen ? 'auto' : 'hidden'
      }}
    >
      <DrawerContent />
    </animated.div>
  )
}
