import {
  addBreadcrumb,
  captureException,
  captureMessage,
  init,
  Severity
} from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import once from 'lodash/once'
import log from 'loglevel'

import packageJson from '../../package.json'
import { SENTRY_DSN } from '../config/environment'

const factory = log.methodFactory

/**
 * Plugin for loglevel which prefixes the current logger name and captures
 * errors, info and debug (as breadcrumb) in Sentry
 */
log.methodFactory = (methodName, logLevel, loggerName) => {
  const method = factory(methodName, logLevel, loggerName)

  return (...args) => {
    // Create log message with logger name prefixed
    const message = [`${loggerName.toString()}:`, ...args].join(' ')

    if (methodName === 'debug') {
      addBreadcrumb({
        type: loggerName.toString(),
        level: Severity.Debug,
        message,
        timestamp: Date.now()
      })
    } else if (methodName === 'info') {
      captureMessage(message)
    } else if (methodName === 'error') {
      captureException(message)
    }
    method(message)
  }
}

export type Logger = log.Logger

// required to apply the plugin
log.setLevel(log.getLevel())

export const createLogger = (loggerName: string) => log.getLogger(loggerName)

export const initLogger = once(() => {
  if (SENTRY_DSN) {
    init({
      dsn: SENTRY_DSN,
      integrations: [new BrowserTracing()],
      release: packageJson.version,
      tracesSampleRate: 1.0
    })
  }
})
