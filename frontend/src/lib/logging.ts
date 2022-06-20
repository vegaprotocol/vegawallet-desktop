import {
  addBreadcrumb,
  captureException,
  captureMessage,
  Severity
} from '@sentry/react'
import log from 'loglevel'

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

// required to apply the plugin
log.setLevel(log.getLevel())

export const createLogger = (loggerName: string) => log.getLogger(loggerName)
