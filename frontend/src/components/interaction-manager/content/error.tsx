import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { ErrorOccured, InteractionContentProps } from '../types'

export const ErrorComponent = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<ErrorOccured>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.content.error,
        intent: Intent.WARNING
      })
      setResolved()
    }
  }, [interaction, isResolved, setResolved])

  return null
}
