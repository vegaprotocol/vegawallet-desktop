import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'
import { IsAppInitialised } from './api/service'
import { useGlobal } from './contexts/global/global-context'

function AppLoader({ children }: { children: React.ReactElement }) {
  const { state, dispatch } = useGlobal()

  React.useEffect(() => {
    IsAppInitialised()
      .then(res => {
        dispatch({ type: 'INIT_APP' })
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  if (!state.init) {
    // TODO: Replace with loading pixel effect
    return <div>Initializing...</div>
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
