import { EventsOff, EventsOn } from '../wailsjs/runtime'

export const enum EVENTS {
  NEW_CONSENT_REQUEST = 'new_consent_request',
  TRANSACTION_SENT = 'transaction_sent'
}

export function createEventSubscription<T>(event: EVENTS) {
  return (callback: (data: T) => void) => {
    EventsOn(event, callback)
    return () => EventsOff(event)
  }
}
