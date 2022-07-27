import type { ApolloClient } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet } from 'react-router-dom'

import { Button } from '../../components/button'
import { Chrome } from '../../components/chrome'
import { Select } from '../../components/forms'
import { Splash } from '../../components/splash'
import {
  changeNetworkAction,
  setDrawerAction
} from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentKeypair } from '../../hooks/use-current-keypair'
import { createClient } from '../../lib/apollo-client'
import { WalletHeader } from './wallet-header'

export const Wallet = () => {
  const {
    state: { networks, networkConfig },
    dispatch
  } = useGlobal()
  const { wallet, keypair } = useCurrentKeypair()
  // false for explicit no node found and null for initial state
  const [client, setClient] = useState<ApolloClient<any> | null | false>(null)

  useEffect(() => {
    let mounted = true

    const safeSetClient = (client: ApolloClient<any> | null | false) => {
      if (mounted) {
        setClient(client)
      }
    }

    const findNodeAndCreateClient = async () => {
      try {
        const index = await findDatanode(networkConfig?.api.graphQl.hosts)
        const datanode = networkConfig?.api.graphQl.hosts[index]
        if (!datanode) {
          safeSetClient(false)
        }
        safeSetClient(createClient(datanode))
      } catch (err) {
        safeSetClient(false)
      }
    }

    findNodeAndCreateClient()

    return () => {
      mounted = false
    }
  }, [networkConfig])

  if (!wallet) {
    return <Navigate to='/' />
  }

  if (client === false) {
    return (
      <Splash style={{ textAlign: 'center' }}>
        {networkConfig ? (
          <>
            <p style={{ marginBottom: 20 }}>
              Could not find a valid data node in network configuration. Please
              try a different network.
            </p>
            <Select
              onChange={e => {
                dispatch(changeNetworkAction(e.target.value))
                dispatch(setDrawerAction(false))
              }}
            >
              {networks.map(network => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </Select>
          </>
        ) : (
          <>
            <p style={{ marginBottom: 20 }}>No networks found</p>
            <Link to='/network-import'>
              <Button>Import network</Button>
            </Link>
          </>
        )}
      </Splash>
    )
  }

  // If null initial data node connect is being attempted
  if (client === null) {
    return null
  }

  return (
    <ApolloProvider client={client}>
      <Chrome>
        <WalletHeader wallet={wallet} keypair={keypair} />
        <Outlet />
      </Chrome>
    </ApolloProvider>
  )
}

const findDatanode = (nodes: string[] | undefined): Promise<number> => {
  if (!nodes?.length) {
    return Promise.resolve(-1)
  }

  const requests = nodes.map(requestToNode)

  return new Promise((resolve, reject) => {
    let hasResolved = false
    const failures = []

    requests.forEach(async req => {
      try {
        const res = await req
        if (!hasResolved) {
          resolve(res)
          hasResolved = true
        }
      } catch (err) {
        failures.push(err)
        if (failures.length >= requests.length) {
          reject(err)
        }
      }
    })
  })
}

const requestToNode = async (n: string, i: number) => {
  const resp = await fetch(n)
  if (!resp.ok) {
    throw new Error(`Failed to connect to node: ${n}`)
  }
  return i
}
