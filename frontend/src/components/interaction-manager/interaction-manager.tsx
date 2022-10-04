import { useState, useEffect } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { EVENTS } from '../../lib/events'
import { parseTx } from '../../lib/transactions'
import { Dialog } from '../dialog'
import { Button } from '../button'
import { EventsOff, EventsOn } from '../../wailsjs/runtime'
import { INTERACTION } from '../../wallet-client/interactions'
import type {
  Interaction,
  RequestWalletConnection,
} from '../../wallet-client/interactions'
import { ConnectionModal } from '../connection-modal'

export type InteractionContentProps<T extends Interaction = Interaction> = {
  model: T
  onRespond: () => void
}

const InitialConnectionModal = ({ model, onRespond }: InteractionContentProps<RequestWalletConnection>) => {
  const { service } = useGlobal()

  const handleResponse = async (decision: boolean) => {
    const a = await service.RespondToInteraction({
      traceId: model.traceId,
      type: 'DECISION',
      content: {
        approved: decision,
      }
    })
    console.log(a)
    onRespond()
  }

  return (
    <Dialog open={true}>
      <div>An application from <strong>"{model.content.hostname}"</strong> wants to connect.</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Button onClick={() => handleResponse(true)}>Approve</Button>
        <Button onClick={() => handleResponse(false)}>Reject</Button>
      </div>
    </Dialog>
  )
}

const InteractionItem = ({ model, onRespond }: InteractionContentProps) => {
  switch (model.type) {
    case INTERACTION.REQUEST_WALLET_CONNECTION_REVIEW: {
      return (
        <InitialConnectionModal model={model} onRespond={onRespond} />
      )
    }
    case INTERACTION.REQUEST_WALLET_SELECTION: {
      return (
        <ConnectionModal model={model} onRespond={onRespond} />
      )
    }
    default: {
      return null
    }
  }
}

/**
 * Handles incoming interactions
 */
export function InteractionManager() {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const { service, dispatch } = useGlobal()

  useEffect(() => {
    const loadTransactions = async () => {
      const [queue, history] = await Promise.all([
        service.ListConsentRequests(),
        service.ListSentTransactions()
      ])
      dispatch({
        type: 'SET_TRANSACTION_QUEUE',
        payload: queue.requests.map(parseTx)
      })
      dispatch({
        type: 'SET_TRANSACTION_HISTORY',
        payload: history.transactions
      })
    }

    loadTransactions()
  }, [service, dispatch])

  console.log(interactions)

  // Get any already pending tx on startup
  useEffect(() => {
    // Listen for new incoming transactions
    EventsOn(EVENTS.NEW_INTERACTION_EVENT, (interaction: Interaction) => {
      console.log(interaction)
      setInteractions(interactions => {
        return ([...interactions, interaction])
      })
    })
    return () => {
      EventsOff(EVENTS.NEW_INTERACTION_EVENT)
    }
  }, [setInteractions])

  if (interactions.length === 0) {
    return null
  }

  return (
    <InteractionItem
      model={interactions[0]}
      onRespond={() => setInteractions(interactions => interactions.slice(1))}
    />
  )
}
