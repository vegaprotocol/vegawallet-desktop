import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'
import {
  GetServiceState,
  GetVersion,
  InitialiseApp,
  IsAppInitialised,
  ListNetworks,
  ListWallets
} from './api/service'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'
import {
  initAppSuccessAction,
  initAppFailureAction
} from './contexts/global/global-actions'
import { ServiceProvider } from './contexts/service/service-provider'

function AppLoader({ children }: { children: React.ReactElement }) {
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised()

        if (!isInit) {
          // For now just pass an empty string so that you always get
          // the default vega home location
          await InitialiseApp({ vegaHome: '' })
        }

        // App initialised check what wallets are available
        const res = await Promise.all([
          await ListNetworks(),
          await ListWallets(),
          await GetServiceState(),
          await GetVersion()
        ])
        dispatch(initAppSuccessAction(...res))
      } catch (err) {
        dispatch(initAppFailureAction())
      }
    }

    run()
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

function App() {
  return (
    <Router>
      <GlobalProvider>
        <AppLoader>
          <ServiceProvider>
            <Chrome>
              <AppRouter />
            </Chrome>
          </ServiceProvider>
        </AppLoader>
      </GlobalProvider>
    </Router>
  )
}

export default App
