import React from 'react'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useNetwork } from '../../contexts/network/network-context'
import {
  startProxyAction,
  stopProxyAction
} from '../../contexts/service/service-actions'
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
  const {
    dispatch,
    state: { proxy }
  } = useService()

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

  function stop() {
    if (!network || !config) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(stopProxyAction(network, config.Port))
  }

  return (
    <table>
      <tbody>
        <tr>
          <th>
            Console{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.Console.URL})
            </span>
          </th>
          <td>
            {proxy === ProxyApp.Console ? (
              <ButtonUnstyled onClick={stop} style={{ textAlign: 'right' }}>
                Stop
              </ButtonUnstyled>
            ) : (
              <ButtonUnstyled
                onClick={() => startProxy(ProxyApp.Console)}
                style={{ textAlign: 'right' }}
              >
                Start
              </ButtonUnstyled>
            )}
          </td>
        </tr>
        <tr>
          <th>
            Token dApp{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.TokenDApp.URL})
            </span>
          </th>
          <td>
            {proxy === ProxyApp.TokenDApp ? (
              <ButtonUnstyled onClick={stop} style={{ textAlign: 'right' }}>
                Stop
              </ButtonUnstyled>
            ) : (
              <ButtonUnstyled onClick={() => startProxy(ProxyApp.TokenDApp)}>
                Start
              </ButtonUnstyled>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
