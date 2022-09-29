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
      <Header>gRPC Nodes</Header>
      <NodeList items={config.api?.grpcConfig?.hosts ?? []} />
      <Header>GraphQL Nodes</Header>
      <NodeList items={config.api?.graphQLConfig?.hosts ?? []} />
      <Header>REST Nodes</Header>
      <NodeList items={config.api?.restConfig?.hosts ?? []} />
      <Header>Application Settings</Header>
      <KeyValueTable
        style={{ fontSize: 16 }}
        rows={[
          {
            key: 'Wallet Service URL',
            value: `http://${config.host}:${config.port}`,
            dataTestId: 'service-url'
          },
          { key: 'Log level', value: config.logLevel, dataTestId: 'log-level' },
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
