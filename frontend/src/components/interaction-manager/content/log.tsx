import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, Log } from '../types'

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

export const LogComponent = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<Log>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.content.message,
        intent: getMessageIntent(interaction.event.content.type)
      })
      setResolved()
    }
  }, [interaction, isResolved, setResolved])

  return null
}
