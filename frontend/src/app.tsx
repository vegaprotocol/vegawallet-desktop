import React from 'react'

import { AppRouter } from './routes'
// Wails doesn't support BrowserRouter
// See https://wails.app/guides/reactrouter/
import { HashRouter as Router } from 'react-router-dom'
import { Chrome } from './components/chrome'

function App() {
  return (
    <Router>
      <Chrome>
        <AppRouter />
      </Chrome>
    </Router>
  )
}

export default App
