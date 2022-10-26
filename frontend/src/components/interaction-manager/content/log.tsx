import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, Log, LogContent } from '../types'

const getMessageIntent = (type: LogContent['type']) => {
  switch (type) {
    case 'Error': {
      return Intent.DANGER
    }
    case 'Warning': {
      return Intent.WARNING
    }
    case 'Success': {
      return Intent.SUCCESS
    }
    default: {
      return Intent.NONE
    }
  }
}

export const LogComponent = ({
  event,
  isResolved,
  setResolved
}: InteractionContentProps<Log>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: event.data.message,
        intent: getMessageIntent(event.data.type)
      })
      setResolved(true)
    }
  }, [event, isResolved, setResolved])

  return null
}
