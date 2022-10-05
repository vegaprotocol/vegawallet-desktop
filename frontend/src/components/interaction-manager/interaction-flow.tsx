import { useState } from 'react'
import { INTERACTION_TYPE, EVENT_FLOW_TYPE } from './types'
import type {
  Interaction,
  InteractionContentProps,
  RequestWalletConnection,
  RequestWalletSelection,
  RequestSucceeded,
  ErrorOccured,
} from './types'

import { WalletConnection } from './content/wallet-connection'
import { WalletSelection } from './content/wallet-selection'
import { SuccessComponent } from './content/success'
import { ErrorComponent } from './content/error'

const InteractionItem = (props: InteractionContentProps) => {
  switch (props.interaction.event.type) {
    case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW: {
      return (
        <WalletConnection {...props as InteractionContentProps<RequestWalletConnection>} />
      )
    }
    case INTERACTION_TYPE.REQUEST_WALLET_SELECTION: {
      return (
        <WalletSelection {...props as InteractionContentProps<RequestWalletSelection>} />
      )
    }
    case INTERACTION_TYPE.REQUEST_SUCCEEDED: {
      return (
        <SuccessComponent {...props as InteractionContentProps<RequestSucceeded>} />
      )
    }
    case INTERACTION_TYPE.ERROR_OCCURRED: {
      return (
        <ErrorComponent {...props as InteractionContentProps<ErrorOccured>} />
      )
    }
    default: {
      return null
    }
  }
}

const getEventFlowType = (events: Interaction[]) => {
  return events.reduce<EVENT_FLOW_TYPE | undefined>((acc, interaction) => {
    switch (interaction.event.type) {
      case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW: {
        return acc || EVENT_FLOW_TYPE.WALLET_CONNECTION
      }
      case INTERACTION_TYPE.REQUEST_WALLET_SELECTION: {
        return acc || EVENT_FLOW_TYPE.WALLET_CONNECTION
      }
      default: {
        return acc
      }
    }
  }, undefined)
}

type InteractionFlowProps = {
  events: Interaction[]
  onFinish: () => void
}

export const InteractionFlow = ({ events, onFinish }: InteractionFlowProps) => {
  const [resolvedEvents, setResolvedEvents] = useState<Record<string, boolean>>({})
  const flow = getEventFlowType(events)

  return (
    <>
      {events.map((event) => (
        <InteractionItem
          key={event.meta.id}
          interaction={event}
          flow={flow}
          onFinish={onFinish}
          isResolved={resolvedEvents[event.meta.id] || false}
          setResolved={() => setResolvedEvents(registry => ({
            ...registry,
            [event.meta.id]: true,
          }))}
        />
      ))}
    </>
  )
}
