import { useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestWalletConnection } from '../types'
import { CONNECTION_RESPONSE, INTERACTION_RESPONSE_TYPE } from '../types'

export const WalletConnection = ({
  event,
  isResolved,
  setResolved
}: InteractionContentProps<RequestWalletConnection>) => {
  const { service } = useGlobal()

  useEffect(() => {
    const handleResponse = async (decision: boolean) => {
      try {
        // @ts-ignore: wails generates the wrong type signature for this handler
        await service.RespondToInteraction({
          traceID: event.traceID,
          name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: decision
              ? CONNECTION_RESPONSE.APPROVED_ONCE
              : CONNECTION_RESPONSE.REJECTED_ONCE
          }
        })
      } catch (err: unknown) {
        AppToaster.show({
          message: `${err}`,
          intent: Intent.DANGER
        })
      }
    }

    if (!isResolved) {
      // automatically accept incoming connections
      setResolved(true)
      handleResponse(true)
    }
  }, [event, service, isResolved, setResolved])

  return null
}
