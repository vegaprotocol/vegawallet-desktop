import { useCallback, useEffect } from 'react'

import { Intent } from '../../../config/intent'
import { useGlobal } from '../../../contexts/global/global-context'
import { AppToaster } from '../../toaster'
import type { InteractionContentProps, RequestWalletConnection } from '../types'
import {INTERACTION_TYPE} from "../types";

export const WalletConnection = ({
  interaction,
  isResolved,
  setResolved
}: InteractionContentProps<RequestWalletConnection>) => {
  const { service } = useGlobal()

  const handleResponse = useCallback(
    async (decision: boolean) => {
      try {
        await service.RespondToInteraction({
          traceId: interaction.event.traceId,
          name: INTERACTION_TYPE.WALLET_CONNECTION_DECISION,
          data: {
            connectionApproval: decision ? 'APPROVED_ONLY_THIS_TIME' : 'REJECTED_ONLY_THIS_TIME',
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
