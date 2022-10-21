import { Colors } from '../../config/colors'
import { useWindowSize } from '../../hooks/use-window-size'
import { ChromeDrawer } from './chrome-drawer'

export const DRAWER_HEIGHT = 70

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { height } = useWindowSize()

  return (
    <>
      <div
        className='vega-border-image'
        style={{
          position: 'relative',
          display: 'block',
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
      >
        <main
          style={{
            height: '100%',
            overflowY: 'auto'
          }}
        >
          {children}
        </main>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          transition: 'bottom 0.2s',
          height: DRAWER_HEIGHT
        }}
      >
        <ChromeDrawer height={height} />
      </div>
    </>
  )
}
