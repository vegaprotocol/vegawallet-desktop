import React from 'react'

import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { AppLoader } from './components/app-loader'
import { GlobalProvider } from './contexts/global/global-provider'

function App() {
  return (
    <Router>
      <GlobalProvider>
        <AppLoader>
          <Chrome>
            {/* <AppRouter /> */}
            <div>App</div>
          </Chrome>
        </AppLoader>
      </GlobalProvider>
    </Router>
  )
}

export default App
