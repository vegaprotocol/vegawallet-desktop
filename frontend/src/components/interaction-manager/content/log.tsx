import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, Log } from '../types'

const getMessageIntent = (type: string) => {
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
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<Log>) => {
  useEffect(() => {
    if (!isResolved) {
      AppToaster.show({
        message: interaction.event.data.message,
        intent: getMessageIntent(interaction.event.data.type)
      })
      setResolved(true)
    }
  }, [interaction, isResolved, setResolved])

  return null
}
