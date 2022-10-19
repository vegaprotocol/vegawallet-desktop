export const enum EVENTS {
  NEW_INTERACTION_EVENT = 'new_interaction',
  NEW_CONSENT_REQUEST = 'new_consent_request',
  TRANSACTION_SENT = 'transaction_sent',
  // Sent when the service is healthy.
  // This event can be emitted every 15 seconds.
  SERVICE_HEALTHY = 'service_is_healthy',
  // Sent when no service is running anymore.
  // This event can be emitted every 15 seconds.
  SERVICE_UNREACHABLE = 'service_unreachable',
  // Sent when the service is unhealthy, meaning we could connect but the endpoint
  // didn't answer what we expected. More in the application logs.
  // This event can be emitted every 15 seconds.
  SERVICE_UNHEALTHY = 'service_is_unhealthy',
  // Sent when the service unexpectedly stopped, internal crash.
  // This event is emitted once per service lifecycle.
  // If emitted, the `ServiceStopped` is not be emitted.
  SERVICE_STOPPED_WITH_ERROR = 'service_stopped_with_error',
  // Sent when the service has been stopped by the user.
  // This event is emitted once per service lifecycle.
  // If emitted, the `ServiceStoppedWithError` is not be emitted.
  SERVICE_STOPPED = 'service_stopped'
}
