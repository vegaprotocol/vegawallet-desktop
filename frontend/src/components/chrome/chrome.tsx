import { Colors } from '../../config/colors'
import { useWindowSize } from '../../hooks/use-window-size'
import { useGlobal, AppStatus } from '../../contexts/global/global-context'
import { ChromeDrawer } from './chrome-drawer'

export const DRAWER_HEIGHT = 70

/**
 * Handles app layout for main content, sidebar and footer
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { state } = useGlobal()
  const { height } = useWindowSize()
  const useVegaBg = state.status === AppStatus.Onboarding

  console.log(state.status)

  return (
    <>
      <div
        className={!useVegaBg ? 'vega-border-image' : undefined}
        style={{
          position: 'relative',
          display: 'block',
          paddingBottom: state.status !== AppStatus.Initialised ? 0 : DRAWER_HEIGHT,
          height: '100%',
          backgroundColor: useVegaBg ? 'transparent' : Colors.DARK_GRAY_1,
          backgroundSize: 'cover',
          borderTop: useVegaBg ? undefined : '3px solid'
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
      {state.status === AppStatus.Initialised && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            transition: 'bottom 0.2s',
            height: state.status !== AppStatus.Initialised  ? 0 : DRAWER_HEIGHT
          }}
        >
          <ChromeDrawer height={height} />
        </div>
      )}
    </>
  )
}
