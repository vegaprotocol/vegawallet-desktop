import React from 'react'
import { Intent } from '../../config/intent'
import { useNetwork } from '../../contexts/network/network-context'
import { startProxyAction } from '../../contexts/service/service-actions'
import { ProxyApp, useService } from '../../contexts/service/service-context'
import { Network } from '../../models/network'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
import { NodeList } from '../node-list'
import { AppToaster } from '../toaster'

export function NetworkInfo() {
  const {
    state: { config }
  } = useNetwork()

  if (!config) {
    return null
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{config.Name}</td>
          </tr>
          <tr>
            <th>Log level</th>
            <td>{config.Level}</td>
          </tr>
          <tr>
            <th>Token expiry</th>
            <td>{config.TokenExpiry}</td>
          </tr>
          <tr>
            <th>Host</th>
            <td>{config.Host}</td>
          </tr>
          <tr>
            <th>Port</th>
            <td>{config.Port}</td>
          </tr>
        </tbody>
      </table>
      <Header>Apps</Header>
      <DAppsTable config={config} />
      <Header>gRPC Nodes</Header>
      <NodeList items={config.API.GRPC.Hosts} />
      <Header>GraphQL Nodes</Header>
      <NodeList items={config.API.GraphQL.Hosts} />
      <Header>REST Nodes</Header>
      <NodeList items={config.API.REST.Hosts} />
    </>
  )
}

interface DAppsTableProps {
  config: Network
}

function DAppsTable({ config }: DAppsTableProps) {
  const {
    state: { network }
  } = useNetwork()
  const { dispatch } = useService()

  function startProxy(app: ProxyApp) {
    if (!network || !config || app === ProxyApp.None) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    const port =
      app === ProxyApp.Console
        ? config.Console.LocalPort
        : config.TokenDApp.LocalPort

    dispatch(startProxyAction(network, app, port))
  }
  return (
    <table>
      <tbody>
        <tr>
          <th>Console</th>
          <td>
            <ButtonUnstyled
              style={{ textAlign: 'right' }}
              onClick={() => startProxy(ProxyApp.Console)}
            >
              Start {config.Console.URL} on http://127.0.0.1:
              {config.Console.LocalPort}
            </ButtonUnstyled>
          </td>
        </tr>
        <tr>
          <th>Token App</th>
          <td>
            <ButtonUnstyled
              style={{ textAlign: 'right' }}
              onClick={() => startProxy(ProxyApp.TokenDApp)}
            >
              Start {config.TokenDApp.URL} on http://127.0.0.1:
              {config.TokenDApp.LocalPort}
            </ButtonUnstyled>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
