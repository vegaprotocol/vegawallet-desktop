import { useEffect } from 'react'
import type { InteractionContentProps, Log } from '../types'
import { AppToaster } from '../../toaster'
import { Intent } from '../../../config/intent'

const getMessageIntent = (type: string) => {
  switch (type) {
    case 'error': {
      return Intent.DANGER
    }
    case 'warning': {
      return Intent.WARNING
    }
    case 'success': {
      return Intent.SUCCESS
    }
    default: {
      return Intent.NONE
    }
  }
}

export const LogComponent = ({ interaction, isResolved, setResolved } : InteractionContentProps<Log>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.content.message,
        intent: getMessageIntent(interaction.event.content.type),
      })
      setResolved()
    }
  }, [interaction, isResolved, setResolved])

  return null
}
