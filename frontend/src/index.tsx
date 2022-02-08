import React from 'react'
import ReactDOM from 'react-dom'
import 'core-js/stable'
import './polyfills'
import './index.css'
import App from './app'
import reportWebVitals from './report-web-vitals'
import * as Wails from '@wailsapp/runtime'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import packageJson from '../package.json'

const dsn = process.env.REACT_APP_SENTRY_DSN || false

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    release: packageJson.version,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0
  })
}

Wails.Init(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
