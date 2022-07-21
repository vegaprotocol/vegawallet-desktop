import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useWindowSize } from '../../hooks/use-window-size'
import { ChromeDrawer } from './chrome-drawer'
import { ChromeSidebar, SIDEBAR_WIDTH } from './chrome-sidebar'

export const DRAWER_HEIGHT = 70

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowSize()
  const { state, dispatch } = useGlobal()
  const isWide = width > 900

  return (
    <>
      <div
        className='vega-border-image'
        style={{
          position: 'relative',
          display: isWide ? 'grid' : 'block',
          gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
          paddingBottom: DRAWER_HEIGHT,
          height: '100%',
          background: Colors.DARK_GRAY_1,
          borderTop: '3px solid'
        }}
      >
        <aside
          style={{
            background: Colors.DARK_GRAY_2,
            borderRight: `1px solid ${Colors.BLACK}`,
            overflowY: 'auto'
          }}
        >
          <ChromeSidebar
            open={state.sidebarOpen}
            setOpen={open => dispatch({ type: 'SET_SIDEBAR', open })}
            isWide={isWide}
            height={height}
          />
        </aside>
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
          height: DRAWER_HEIGHT
        }}
      >
        <ChromeDrawer height={height} />
      </div>
    </>
  )
}
