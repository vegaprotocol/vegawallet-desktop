import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import { initAppAction } from './contexts/global/global-actions'
import { ServiceProvider } from './contexts/service/service-provider'
import { PassphraseModal } from './components/passphrase-modal'
import { NetworkProvider } from './contexts/network/network-provider'
import { Onboard } from './components/onboard'
import { useCheckForUpdate } from './hooks/use-check-for-update'

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
      <Splash className='vega-bg' style={{ backgroundSize: 'cover' }}>
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
            <AppLoader>
              <Chrome>
                <AppRouter />
              </Chrome>
              <PassphraseModal />
            </AppLoader>
          </ServiceProvider>
        </NetworkProvider>
      </GlobalProvider>
    </Router>
  )
}

export default App
