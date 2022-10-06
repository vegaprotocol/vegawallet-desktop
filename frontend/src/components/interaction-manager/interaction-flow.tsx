import { useState } from 'react'

import { ErrorComponent } from './content/error'
import { LogComponent } from './content/log'
import { SessionEndComponent } from './content/session-end'
import { SuccessComponent } from './content/success'
import { WalletConnection } from './content/wallet-connection'
import { WalletSelection } from './content/wallet-selection'
import type {
  ErrorOccurred,
  Interaction,
  InteractionContentProps,
  Log,
  RequestSucceeded,
  RequestWalletConnection,
  RequestWalletSelection,
  SessionEnded
} from './types'
import { EVENT_FLOW_TYPE, INTERACTION_TYPE } from './types'

const InteractionItem = (props: InteractionContentProps) => {
  switch (props.interaction.event.name) {
    case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW: {
      return (
        <WalletConnection
          {...(props as InteractionContentProps<RequestWalletConnection>)}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_WALLET_SELECTION: {
      return (
        <WalletSelection
          {...(props as InteractionContentProps<RequestWalletSelection>)}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_SUCCEEDED: {
      return (
        <SuccessComponent
          {...(props as InteractionContentProps<RequestSucceeded>)}
        />
      )
    }
    case INTERACTION_TYPE.ERROR_OCCURRED: {
      return (
        <ErrorComponent {...(props as InteractionContentProps<ErrorOccurred>)} />
      )
    }
    case INTERACTION_TYPE.LOG: {
      return <LogComponent {...(props as InteractionContentProps<Log>)} />
    }
    case INTERACTION_TYPE.INTERACTION_SESSION_ENDED: {
      return (
        <SessionEndComponent
          {...(props as InteractionContentProps<SessionEnded>)}
        />
      )
    }
    default: {
      return null
    }
  }
}

const getEventFlowType = (events: Interaction[]) => {
  return events.reduce<EVENT_FLOW_TYPE | undefined>((acc, interaction) => {
    switch (interaction.event.name) {
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
  const [resolvedEvents, setResolvedEvents] = useState<Record<string, boolean>>(
    {}
  )
  const flow = getEventFlowType(events)

  return (
    <>
      {events.map(event => (
        <InteractionItem
          key={event.meta.id}
          interaction={event}
          flow={flow}
          onFinish={onFinish}
          isResolved={resolvedEvents[event.meta.id] || false}
          setResolved={() =>
            setResolvedEvents(registry => ({
              ...registry,
              [event.meta.id]: true
            }))
          }
        />
      ))}
    </>
  )
}
