import { useEffect } from 'react'
import { EVENT_FLOW_TYPE } from '../types'
import type { InteractionContentProps, RequestSucceeded } from '../types'
import { AppToaster } from '../../toaster'
import { Intent } from '../../../config/intent'

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

export const SuccessComponent = ({ interaction, flow, isResolved, onFinish }: InteractionContentProps<RequestSucceeded>) => {
  const message = getSuccessMessage(flow)

  useEffect(() => {
    if (!isResolved && message) {
      AppToaster.show({
        message,
        intent: Intent.SUCCESS,
      })
      onFinish()
    }
  }, [interaction, message, isResolved])

  return null
}
