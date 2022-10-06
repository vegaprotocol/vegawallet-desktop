import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { ErrorOccurred, InteractionContentProps } from '../types'

export const ErrorComponent = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<ErrorOccurred>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.data.error,
        intent: Intent.WARNING
      })
      setResolved()
    }
  }, [interaction, isResolved, setResolved])

  return null
}
