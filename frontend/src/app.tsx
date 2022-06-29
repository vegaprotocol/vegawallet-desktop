import { ApolloProvider } from '@apollo/client'
import { useEffect, useMemo } from 'react'
// Wails recommends to use Hash routing.
// See https://wails.io/docs/guides/routing
import { HashRouter as Router } from 'react-router-dom'

import { PassphraseModal } from './components/passphrase-modal'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import { TransactionManager } from './components/transaction-manager'
import { Colors } from './config/colors'
import { initAppAction } from './contexts/global/global-actions'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { GlobalProvider } from './contexts/global/global-provider'
import { useCheckForUpdate } from './hooks/use-check-for-update'
import { useIsOnboard } from './hooks/use-is-onboard'
import { createClient } from './lib/apollo-client'
import { AppRouter } from './routes'

/**
 * Initialiases the app
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  useCheckForUpdate()

  const {
    state: { status, networkConfig },
    dispatch
  } = useGlobal()

  // Get wallets, service state and version
  useEffect(() => {
    dispatch(initAppAction())
  }, [dispatch])

  const client = useMemo(() => {
    // TODO: Intelligently select a node, promise race
    const datanode = networkConfig?.api.graphQl.hosts[0]

    if (!datanode) {
      return null
    }

    return createClient(datanode)
  }, [networkConfig])

  if (status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (status === AppStatus.Failed) {
    return (
      <Splash>
        <p>Failed to initialise</p>
      </Splash>
    )
  }

  if (!client) {
    return (
      <Splash>
        <p>Could not find a valid data node in network configuration</p>
      </Splash>
    )
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

/**
 * Renders all the providers
 */
function App() {
  return (
    <Router>
      <GlobalProvider>
        <AppFrame>
          <AppLoader>
            <AppRouter />
            <PassphraseModal />
            <TransactionManager />
          </AppLoader>
        </AppFrame>
      </GlobalProvider>
    </Router>
  )
}

export default App

export const APP_FRAME_HEIGHT = 35

interface AppFrameProps {
  children: React.ReactNode
}

/**
 * Renders a bar at the top of the app with the data-wails-drag attribute which lets you
 * drag the app window aroung. Also renders the vega-bg className if onboard mode
 */
function AppFrame({ children }: AppFrameProps) {
  const isOnboard = useIsOnboard()

  return (
    <div
      style={{
        height: '100%',
        paddingTop: APP_FRAME_HEIGHT,
        backgroundSize: 'cover'
      }}
      className={isOnboard ? 'vega-bg' : undefined}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: APP_FRAME_HEIGHT,
          backgroundColor: isOnboard ? 'transparent' : Colors.BLACK
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
