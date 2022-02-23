import 'core-js/stable'
import './index.css'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import ReactDOM from 'react-dom'

import packageJson from '../package.json'
import App from './app'
import { SENTRY_DSN } from './config/environment'

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    release: packageJson.version,
    tracesSampleRate: 1.0
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
)
