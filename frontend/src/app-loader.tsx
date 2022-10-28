import type { ErrorInfo, ReactNode } from 'react'
import { Component, useEffect } from 'react'

import { Button } from './components/button'
import { ServiceLoader } from './components/service-loader'
import { Splash } from './components/splash'
import { SplashError } from './components/splash-error'
import { SplashLoader } from './components/splash-loader'
import { Colors } from './config/colors'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { createLogger } from './lib/logging'
import { WindowReload } from './wailsjs/runtime'

/**
 * Initialiases the app
 */
export function AppLoader({ children }: { children: React.ReactNode }) {
  const {
    state: { status },
    actions,
    dispatch
  } = useGlobal()

  // Get wallets, service state and version
  useEffect(() => {
    dispatch(actions.initAppAction())
  }, [dispatch, actions])

  if (status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (status === AppStatus.Failed) {
    return (
      <SplashError
        message='Failed to initialise'
        actions={<Button onClick={() => WindowReload()}>Reload</Button>}
      />
    )
  }

  return <ServiceLoader>{children}</ServiceLoader>
}

export const APP_FRAME_HEIGHT = 35
interface AppFrameProps {
  children: React.ReactNode
}

/**
 * Renders a bar at the top of the app with the data-wails-drag attribute which lets you
 * drag the app window aroung. Also renders the vega-bg className if onboard mode
 */
export function AppFrame({ children }: AppFrameProps) {
  const { state } = useGlobal()
  const useVegaBg = state.status === AppStatus.Onboarding
  return (
    <div
      style={{
        height: '100%',
        paddingTop: APP_FRAME_HEIGHT,
        backgroundSize: 'cover',
        backgroundColor: Colors.DARK_GRAY_1,
        position: 'relative',
        overflowY: 'auto'
      }}
      data-testid='app-frame'
      className={useVegaBg ? 'vega-bg' : undefined}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: APP_FRAME_HEIGHT,
          backgroundColor: useVegaBg ? 'transparent' : Colors.BLACK,
          // The app is frameless by default so this element creates a space at the top of the app
          // which you can click and drag to move the app around.
          // https://wails.io/docs/guides/frameless/
          // @ts-ignore: Allow custom css property for wails
          '--wails-draggable': 'drag'
        }}
      />
      {children}
    </div>
  )
}

const logger = createLogger('ErrorBoundary')

export class ErrorBoundary extends Component<{ children: ReactNode }> {
  state: { error: Error | null } = {
    error: null
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(error, errorInfo.componentStack)
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <SplashError
          message={`Something went wrong: ${error.message}`}
          actions={<Button onClick={() => WindowReload()}>Reload</Button>}
        />
      )
    }

    return this.props.children
  }
}
