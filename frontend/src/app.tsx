import React from 'react'
import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'
import { GlobalProvider } from './contexts/global/global-provider'

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Chrome>
          <AppRouter />
        </Chrome>
      </GlobalProvider>
    </Router>
  )
}

export default App
