import { ErrorBoundary } from '@sentry/react'
// Wails recommends to use Hash routing.
// See https://wails.io/docs/guides/routing
import { HashRouter as Router } from 'react-router-dom'

import { AppFrame, AppLoader } from './app-loader'
import { PassphraseModal } from './components/passphrase-modal'
import { TransactionManager } from './components/transaction-manager'
import { GlobalProvider } from './contexts/global/global-provider'
import { AppRouter } from './routes'

/**
 * Renders all the providers
 */
function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

export default App
