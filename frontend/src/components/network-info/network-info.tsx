import React from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { Header } from '../header'
import { KeyValueTable } from '../key-value-table'
import { NodeList } from '../node-list'

export function NetworkInfo() {
  const {
    state: { networkConfig: config }
  } = useGlobal()

  if (!config) {
    return null
  }

  return (
    <>
      <Header>Wallet Service / DApps</Header>
      <Header>gRPC Nodes</Header>
      <NodeList items={config.api.grpc.hosts} />
      <Header>GraphQL Nodes</Header>
      <NodeList items={config.api.graphQl.hosts} />
      <Header>REST Nodes</Header>
      <NodeList items={config.api.rest.hosts} />
      <Header>Application Settings</Header>
      <KeyValueTable
        style={{ fontSize: 16 }}
        rows={[
          { key: 'Log level', value: config.level, dataTestId: 'log-level' },
          {
            key: 'Token expiry',
            value: config.tokenExpiry,
            dataTestId: 'token-expiry'
          }
        ]}
      />
    </>
  )
}
