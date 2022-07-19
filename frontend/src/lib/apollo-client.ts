import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient as createWSClient } from 'graphql-ws'

import { createLogger } from './logging'

const logger = createLogger('ApolloClient')

export function createClient(base?: string) {
  if (!base) {
    throw new Error('Base must be passed into createClient!')
  }
  const gqlPath = 'query'
  const urlHTTP = new URL(gqlPath, base)
  const urlWS = new URL(gqlPath, base)
  // Replace http with ws, preserving if its a secure connection eg. https => wss
  urlWS.protocol = urlWS.protocol.replace('http', 'ws')

  const cache = new InMemoryCache({
    typePolicies: {
      Account: {
        keyFields: false,
        fields: {
          balanceFormatted: {}
        }
      },
      Instrument: {
        keyFields: false
      },
      MarketData: {
        keyFields: ['market', ['id']]
      },
      Node: {
        keyFields: false
      },
      Withdrawal: {
        fields: {
          pendingOnForeignChain: {
            read: (isPending = false) => isPending
          }
        }
      }
    }
  })

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: 10000,
      jitter: true
    }
  })

  const httpLink = new HttpLink({
    uri: urlHTTP.href,
    credentials: 'same-origin'
  })

  const wsLink = new GraphQLWsLink(
    createWSClient({
      url: urlWS.href
    })
  )

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.length) {
      logger.error(graphQLErrors.map(e => e.message).join(', '))
    }
    if (networkError) {
      logger.error(networkError.message)
    }
  })

  return new ApolloClient({
    connectToDevTools: import.meta.env.MODE === 'development',
    link: from([errorLink, retryLink, splitLink]),
    cache
  })
}
