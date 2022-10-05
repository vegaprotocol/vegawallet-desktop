import { useEffect } from 'react'
import type { InteractionContentProps, ErrorOccured } from '../types'
import { AppToaster } from '../../toaster'
import { Intent } from '../../../config/intent'

export const ErrorComponent = ({ interaction, isResolved, setResolved } : InteractionContentProps<ErrorOccured>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.content.error,
        intent: Intent.WARNING,
      })
      setResolved()
    }
  }, [interaction, isResolved, setResolved])

  return null
}
