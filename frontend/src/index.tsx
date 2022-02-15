import 'core-js/stable'
import './index.css'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import React from 'react'
import ReactDOM from 'react-dom'

import packageJson from '../package.json'
import App from './app'

const dsn = process.env.REACT_APP_SENTRY_DSN || false

if (dsn) {
  Sentry.init({
    dsn,
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
