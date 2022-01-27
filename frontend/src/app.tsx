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
import { CheckVersion } from './api/service'
import { AppToaster } from './components/toaster'

/**
 * Initialiases the app
 */
function AppLoader({ children }: { children: React.ReactElement }) {
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

  return children
}

/**
 * Renders all the providers
 */
function App() {
  return (
    <Router>
      <GlobalProvider>
        <AppLoader>
          <NetworkProvider>
            <ServiceProvider>
              <Chrome>
                <AppRouter />
              </Chrome>
              <PassphraseModal />
            </ServiceProvider>
          </NetworkProvider>
        </AppLoader>
      </GlobalProvider>
    </Router>
  )
}

/**
 * Calls CheckVersion and shows a toast if theres a new version to update to
 */
function useCheckForUpdate() {
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await CheckVersion()
        // if string is empty no version to update to
        if (res) {
          AppToaster.show({
            message: (
              <>
                Version {res.version} is now available on{' '}
                <a href={res.releaseUrl}>Github</a>
              </>
            ),
            timeout: 0
          })
        }
      } catch (err) {
        // No op for now
        // TODO: logging?
      }
    }

    run()
  }, [])
}

export default App
