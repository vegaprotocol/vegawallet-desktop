import type { ErrorInfo, ReactNode } from 'react'
import { Component, useEffect } from 'react'
import { useMatch } from 'react-router-dom'

import { Button } from './components/button'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import { Colors } from './config/colors'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { useCheckForUpdate } from './hooks/use-check-for-update'
import { createLogger } from './lib/logging'
import { WindowReload } from './wailsjs/runtime/runtime'

/**
 * Initialiases the app
 */
export function AppLoader({ children }: { children: React.ReactNode }) {
  useCheckForUpdate()

  const {
    state: { status, network, networkConfig },
    actions,
    dispatch
  } = useGlobal()

  // Get wallets, service state and version
  useEffect(() => {
    dispatch(actions.initAppAction())
  }, [dispatch, actions])

  useEffect(() => {
    if (network && networkConfig) {
      dispatch(actions.startServiceAction())
    }
  }, [network, networkConfig, dispatch, actions])

  if (status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (status === AppStatus.Failed) {
    return (
      <Splash style={{ textAlign: 'center' }}>
        <p>Failed to initialise</p>
      </Splash>
    )
  }

  return <>{children}</>
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
  const walletMatch = useMatch('/wallet/*')
  const useVegaBg = !Boolean(walletMatch)
  return (
    <div
      style={{
        height: '100%',
        paddingTop: APP_FRAME_HEIGHT,
        backgroundSize: 'cover'
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
          backgroundColor: useVegaBg ? 'transparent' : Colors.BLACK
        }}
        // The app is frameless by default so this element creates a space at the top of the app
        // which you can click and drag to move the app around. The drag function is triggered
        // by the data-wails drag element
        data-wails-drag
      />
      {children}
    </div>
  )
}

const logger = createLogger('ErrorBoundary')

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = {
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
        <Splash style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 10 }}>
            {/* @ts-ignore */}
            Something went wrong: {error.message}
          </p>
          <Button onClick={() => WindowReload()}>Reload</Button>
        </Splash>
      )
    }

    return this.props.children
  }
}
