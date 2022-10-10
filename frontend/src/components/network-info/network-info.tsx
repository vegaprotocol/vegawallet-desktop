import { useGlobal } from '../../contexts/global/global-context'
import { Title } from '../title'
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
      <Title>gRPC Nodes</Title>
      <NodeList items={config.api?.grpcConfig?.hosts ?? []} />
      <Title>GraphQL Nodes</Title>
      <NodeList items={config.api?.graphQLConfig?.hosts ?? []} />
      <Title>REST Nodes</Title>
      <NodeList items={config.api?.restConfig?.hosts ?? []} />
      <Title>Application Settings</Title>
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
