import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestSucceeded } from '../types'

export const SuccessComponent = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<RequestSucceeded>) => {
  const message = interaction.event.data.message

  useEffect(() => {
    if (!isResolved && message) {
      AppToaster.show({
        message,
        intent: Intent.SUCCESS
      })
      setResolved()
    }
  }, [interaction, message, isResolved, setResolved])

  return null
}
