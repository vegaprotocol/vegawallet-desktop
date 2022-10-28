import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestSucceeded } from '../types'

export const SuccessComponent = ({
  event,
  isResolved,
  setResolved
}: InteractionContentProps<RequestSucceeded>) => {
  const message = event.data.message

  useEffect(() => {
    if (!isResolved && message) {
      AppToaster.show({
        message,
        intent: Intent.SUCCESS
      })
      setResolved(true)
    }
  }, [event, message, isResolved, setResolved])

  return null
}
