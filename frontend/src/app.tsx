import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'
import {
  GetServiceState,
  IsAppInitialised,
  ListNetworks,
  ListWallets
} from './api/service'
import { AppStatus, useGlobal } from './contexts/global/global-context'
import { Splash } from './components/splash'
import { SplashLoader } from './components/splash-loader'

function AppLoader({ children }: { children: React.ReactElement }) {
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    async function run() {
      try {
        const isInit = await IsAppInitialised()

        // App initialised check what wallets are available
        if (isInit) {
          const res = await Promise.all([
            await ListNetworks(),
            await ListWallets(),
            await GetServiceState()
          ])
          dispatch({
            type: 'INIT_APP',
            isInit: true,
            networks: res[0].networks,
            wallets: res[1].wallets,
            serviceRunning: res[2].Running,
            serviceUrl: res[2].URL
          })
        } else {
          dispatch({
            type: 'INIT_APP',
            isInit: false,
            wallets: [],
            networks: [],
            serviceRunning: false,
            serviceUrl: ''
          })
        }
      } catch (err) {
        dispatch({
          type: 'INIT_APP',
          isInit: false,
          wallets: [],
          networks: [],
          serviceRunning: false,
          serviceUrl: ''
        })
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
          <Chrome>
            <AppRouter />
          </Chrome>
        </AppLoader>
      </GlobalProvider>
    </Router>
  )
}

export default App
