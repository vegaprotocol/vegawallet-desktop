import React from 'react'
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
import {
  initNetworksAction,
  initProxies,
  startServiceAction
} from './contexts/network/network-actions'
import { useNetwork } from './contexts/network/network-context'
import { NetworkProvider } from './contexts/network/network-provider'
import { useCheckForUpdate } from './hooks/use-check-for-update'
import { useIsOnboard } from './hooks/use-is-onboard'
import { AppRouter } from './routes'

/**
 * Initialiases the app
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  useCheckForUpdate()
  const { state: globalState, dispatch: globalDispatch } = useGlobal()
  const { state: networkState, dispatch: networkDispatch } = useNetwork()

  // Get wallets, service state and version
  React.useEffect(() => {
    globalDispatch(initAppAction())
  }, [globalDispatch])

  // Get stored networks and the default network config
  React.useEffect(() => {
    if (
      globalState.status === AppStatus.Initialised ||
      globalState.status === AppStatus.Onboarding
    ) {
      networkDispatch(initNetworksAction(globalState.config))
      networkDispatch(initProxies())
    }
    // cant use globalState.config as this will trigger render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.status, networkDispatch])

  // Start service on app startup and when network or config changes
  React.useEffect(() => {
    if (!networkState.network || !networkState.config) return
    networkDispatch(
      startServiceAction(networkState.network, networkState.config.port)
    )
  }, [networkState.network, networkState.config, networkDispatch])

  if (globalState.status === AppStatus.Pending) {
    return (
      <Splash>
        <SplashLoader />
      </Splash>
    )
  }

  if (globalState.status === AppStatus.Failed) {
    return (
      <Splash>
        <p>Failed to initialise</p>
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
          <AppFrame>
            <AppLoader>
              <AppRouter />
              <PassphraseModal />
              <TransactionManager />
            </AppLoader>
          </AppFrame>
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
