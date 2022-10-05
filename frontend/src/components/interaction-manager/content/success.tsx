import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestSucceeded } from '../types'
import { EVENT_FLOW_TYPE } from '../types'

const getSuccessMessage = (flow?: EVENT_FLOW_TYPE) => {
  switch (flow) {
    case EVENT_FLOW_TYPE.WALLET_CONNECTION: {
      return `Connection approved`
    }
    default: {
      return undefined
    }
  }
}

export const SuccessComponent = ({
  interaction,
  flow,
  isResolved,
  setResolved
}: InteractionContentProps<RequestSucceeded>) => {
  const message = getSuccessMessage(flow)

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
