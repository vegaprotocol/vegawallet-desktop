import { useCallback, useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestWalletConnection } from '../types'
import { INTERACTION_RESPONSE_TYPE, CONNECTION_RESPONSE } from "../types";

export const WalletConnection = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<RequestWalletConnection>) => {
  const { service } = useGlobal()

  const handleResponse = useCallback(
    async (decision: boolean) => {
      try {
        console.log('SENDING: ', {
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: decision ? CONNECTION_RESPONSE.APPROVED_ONCE : CONNECTION_RESPONSE.REJECTED_ONCE,
          }
        })
        await service.RespondToInteraction({
          traceID: interaction.event.traceID,
          name: INTERACTION_RESPONSE_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: decision ? CONNECTION_RESPONSE.APPROVED_ONCE : CONNECTION_RESPONSE.REJECTED_ONCE,
          }
        })
      } catch (err: unknown) {
        AppToaster.show({
          message:
            err instanceof Error
              ? err.message
              : `There was an error handling an incoming connection from ${interaction.event.data.hostname}`,
          intent: Intent.DANGER
        })
      }

      setResolved()
    },
    [service, interaction, setResolved]
  )

  useEffect(() => {
    if (!isResolved) {
      // automatically accept incoming connections
      handleResponse(true)
    }
  }, [handleResponse, isResolved])

  return null
}
