import { ErrorBoundary } from '@sentry/react'
// Wails recommends to use Hash routing.
// See https://wails.io/docs/guides/routing
import { HashRouter as Router } from 'react-router-dom'

import { AppFrame, AppLoader } from './app-loader'
import { Chrome } from './components/chrome'
import { InteractionManager } from './components/interaction-manager'
import { PassphraseModal } from './components/passphrase-modal'
import { Settings } from './components/settings'
import { GlobalProvider } from './contexts/global/global-provider'
import { createLogger, initLogger } from './lib/logging'
import { AppRouter } from './routes'
import { Service } from './service'

const logger = createLogger('GlobalActions')

/**
 * Renders all the providers
 */
function App() {
  return (
    <ErrorBoundary>
      <GlobalProvider
        service={Service}
        logger={logger}
        enableTelemetry={initLogger}
      >
        <Router>
          <AppFrame>
            <Chrome>
              <AppLoader>
                <AppRouter />
                <PassphraseModal />
                <InteractionManager />
                <Settings />
              </AppLoader>
            </Chrome>
          </AppFrame>
        </Router>
      </GlobalProvider>
    </ErrorBoundary>
  )
}

export default App
