import { useEffect, useCallback } from 'react'
import { useGlobal } from '../../../contexts/global/global-context'
import { Intent } from '../../../config/intent'
import { AppToaster } from '../../toaster'
import type {
  InteractionContentProps,
  RequestWalletConnection,
} from '../types'

export const WalletConnection = ({ interaction, isResolved, setResolved }: InteractionContentProps<RequestWalletConnection>) => {
  const { service } = useGlobal()

  const handleResponse = useCallback(async (decision: boolean) => {
    try {
      await service.RespondToInteraction({
        traceId: interaction.event.traceId,
        type: 'DECISION',
        content: {
          approved: decision,
        }
      })
    } catch (err: unknown) {
      AppToaster.show({
        message: err instanceof Error ? err.message : `There was an error handling an incoming connection from ${interaction.event.content.hostname}`,
        intent: Intent.DANGER,
      })
    }

    setResolved()
  }, [])

  useEffect(() => {
    if (!isResolved) {
      // automatically accept incoming connections
      handleResponse(true)
    }
  }, [handleResponse, isResolved])

  return null
}
