import { useState } from 'react'

import { ErrorComponent } from './content/error'
import { LogComponent } from './content/log'
import { Passphrase } from './content/passphrase'
import { Permissions } from './content/permissions'
import { SessionEndComponent } from './content/session-end'
import { SuccessComponent } from './content/success'
import { WalletConnection } from './content/wallet-connection'
import { WalletSelection } from './content/wallet-selection'
import { Transaction } from './content/transaction'
import type {
  ErrorOccurred,
  InteractionContentProps,
  Log,
  RequestTransactionSending,
  RequestPassphrase,
  RequestPermissions,
  RequestSucceeded,
  RequestWalletConnection,
  RequestWalletSelection,
  SessionEnded
} from './types'
import { EVENT_FLOW_TYPE, INTERACTION_TYPE } from './types'

const InteractionItem = (
  props: Omit<InteractionContentProps, 'isResolved' | 'setResolved'>
) => {
  const [isResolved, setResolved] = useState(false)

  switch (props.interaction.event.name) {
    case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW: {
      return (
        <WalletConnection
          {...(props as InteractionContentProps<RequestWalletConnection>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_WALLET_SELECTION: {
      return (
        <WalletSelection
          {...(props as InteractionContentProps<RequestWalletSelection>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW: {
      return (
        <Permissions
          {...(props as InteractionContentProps<RequestPermissions>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING: {
      return (
        <Transaction
          {...(props as InteractionContentProps<RequestTransactionSending>)}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_PASSPHRASE: {
      return (
        <Passphrase
          {...(props as InteractionContentProps<RequestPassphrase>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_SUCCEEDED: {
      return (
        <SuccessComponent
          {...(props as InteractionContentProps<RequestSucceeded>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.ERROR_OCCURRED: {
      return (
        <ErrorComponent
          {...(props as InteractionContentProps<ErrorOccurred>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.LOG: {
      return (
        <LogComponent
          {...(props as InteractionContentProps<Log>)}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.INTERACTION_SESSION_ENDED: {
      return (
        <SessionEndComponent
          {...(props as InteractionContentProps<SessionEnded>)}
          isResolved={isResolved}
          setResolved={setResolved}
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
      case INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW: {
        return acc || EVENT_FLOW_TYPE.PERMISSION_REQUEST
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
  const flow = getEventFlowType(events)

  return (
    <>
      {events.map(event => (
        <InteractionItem
          key={event.meta.id}
          interaction={event}
          flow={flow}
          onFinish={onFinish}
        />
      ))}
    </>
  )
}
