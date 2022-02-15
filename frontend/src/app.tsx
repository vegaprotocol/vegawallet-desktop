import React from 'react'
// Wails recommends to use Hash routing.
// See https://wails.io/docs/guides/routing
import { HashRouter as Router, useRouteMatch } from 'react-router-dom'

import { Chrome } from './components/chrome'
import { Onboard, OnboardPaths } from './components/onboard'
import { PassphraseModal } from './components/passphrase-modal'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import { Colors } from './config/colors'
import { initAppAction } from './contexts/global/global-actions'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { GlobalProvider } from './contexts/global/global-provider'
import { NetworkProvider } from './contexts/network/network-provider'
import { ServiceProvider } from './contexts/service/service-provider'
import { useCheckForUpdate } from './hooks/use-check-for-update'
import { AppRouter } from './routes'

/**
 * Initialiases the app
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  useCheckForUpdate()
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    dispatch(initAppAction())
  }, [dispatch])

  if (state.status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (state.status === AppStatus.Failed) {
    return (
      <Splash>
        <p>Failed to initialise</p>
      </Splash>
    )
  }

  if (state.status === AppStatus.Onboarding) {
    return (
      <Splash>
        <Onboard />
      </Splash>
    )
  }

  return <>{children}</>
}

/**
 * Renders all the providers
 */
function App() {
  return (
    <Router>
      <GlobalProvider>
        <NetworkProvider>
          <ServiceProvider>
            <AppFrame>
              <AppLoader>
                <Chrome>
                  <AppRouter />
                </Chrome>
                <PassphraseModal />
              </AppLoader>
            </AppFrame>
          </ServiceProvider>
        </NetworkProvider>
      </GlobalProvider>
    </Router>
  )
}

export default App

export const APP_FRAME_HEIGHT = 35

interface AppFrameProps {
  children: React.ReactNode
}

function AppFrame({ children }: AppFrameProps) {
  const match = useRouteMatch(OnboardPaths.Home)
  return (
    <div
      style={{
        height: '100%',
        paddingTop: APP_FRAME_HEIGHT,
        backgroundSize: 'cover'
      }}
      className={match ? 'vega-bg' : undefined}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: APP_FRAME_HEIGHT,
          backgroundColor: match ? 'transparent' : Colors.BLACK
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
