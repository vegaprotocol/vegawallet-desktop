import { useState } from 'react'

import { ErrorComponent } from './content/error'
import { LogComponent } from './content/log'
import { Passphrase } from './content/passphrase'
import { Permissions } from './content/permissions'
import { SessionEndComponent } from './content/session-end'
import { SuccessComponent } from './content/success'
import { Transaction } from './content/transaction'
import { TransactionEnd } from './content/transaction-end'
import { WalletConnection } from './content/wallet-connection'
import { WalletSelection } from './content/wallet-selection'
import type {
  Interaction,
  InteractionContentProps,
  RawInteraction,
} from './types'
import { EVENT_FLOW_TYPE, INTERACTION_TYPE } from './types'

const InteractionItem = ({
  event,
  history,
  onFinish
}: Omit<InteractionContentProps<RawInteraction>, 'isResolved' | 'setResolved'>) => {
  const [isResolved, setResolved] = useState(false)

  switch (event.name) {
    case INTERACTION_TYPE.REQUEST_WALLET_CONNECTION_REVIEW: {
      return (
        <WalletConnection
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_WALLET_SELECTION: {
      return (
        <WalletSelection
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_PERMISSIONS_REVIEW: {
      return (
        <Permissions
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_TRANSACTION_REVIEW_FOR_SENDING: {
      return (
        <Transaction
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.TRANSACTION_SUCCEEDED: {
      return (
        <TransactionEnd
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.TRANSACTION_FAILED: {
      return (
        <TransactionEnd
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_PASSPHRASE: {
      return (
        <Passphrase
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.REQUEST_SUCCEEDED: {
      return (
        <SuccessComponent
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.ERROR_OCCURRED: {
      return (
        <ErrorComponent
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.LOG: {
      return (
        <LogComponent
          event={event}
          history={history}
          onFinish={onFinish}
          isResolved={isResolved}
          setResolved={setResolved}
        />
      )
    }
    case INTERACTION_TYPE.INTERACTION_SESSION_ENDED: {
      return (
        <SessionEndComponent
          event={event}
          history={history}
          onFinish={onFinish}
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
      {events.map(interaction => (
        <InteractionItem
          key={interaction.meta.id}
          history={events}
          event={interaction.event}
          flow={flow}
          onFinish={onFinish}
        />
      ))}
    </>
  )
}
