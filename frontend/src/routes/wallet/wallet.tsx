import { ApolloProvider } from '@apollo/client'
import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'

import { Chrome } from '../../components/chrome'
import { Splash } from '../../components/splash'
import { useGlobal } from '../../contexts/global/global-context'
import { createClient } from '../../lib/apollo-client'

export const Wallet = () => {
  const {
    state: { networkConfig }
  } = useGlobal()

  const client = useMemo(() => {
    // TODO: Intelligently select a node, promise race
    const datanode = networkConfig?.api.graphQl.hosts[0]

    if (!datanode) {
      return null
    }

    return createClient(datanode)
  }, [networkConfig])

  if (!client) {
    return (
      <Splash>
        <p>Could not find a valid data node in network configuration</p>
      </Splash>
    )
  }

  return (
    <ApolloProvider client={client}>
      <Chrome>
        <Outlet />
      </Chrome>
    </ApolloProvider>
  )
}
