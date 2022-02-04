import React from 'react'
import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useNetwork } from '../../contexts/network/network-context'
import {
  startProxyAction,
  stopProxyAction
} from '../../contexts/service/service-actions'
import { ProxyApp, useService } from '../../contexts/service/service-context'
import { Network, ProxyDAppConfig } from '../../models/network'
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
  return (
    <table>
      <tbody>
        <tr>
          <th>
            Console{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.Console.URL || 'Not set'})
            </span>
          </th>
          <td>
            <DAppProxyControl
              proxyApp={ProxyApp.Console}
              proxyConfig={config.Console}
            />
          </td>
        </tr>
        <tr>
          <th>
            Token dApp{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.TokenDApp.URL || 'Not set'})
            </span>
          </th>
          <td>
            <DAppProxyControl
              proxyApp={ProxyApp.TokenDApp}
              proxyConfig={config.TokenDApp}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

interface DAppProxyControlProps {
  proxyApp: ProxyApp
  proxyConfig: ProxyDAppConfig
}

function DAppProxyControl({ proxyApp, proxyConfig }: DAppProxyControlProps) {
  const {
    state: { config, network }
  } = useNetwork()
  const {
    dispatch,
    state: { proxy: currentProxyApp }
  } = useService()

  function startProxy(c: ProxyDAppConfig) {
    if (!network || !c) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(startProxyAction(network, proxyApp, c.LocalPort))
  }

  function stopProxy() {
    if (!network || !config) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(stopProxyAction(network, config.Port))
  }

  // Need both of these set to start the proxy! User has the ability to edit these and
  // they could be empty
  if (!proxyConfig.URL || !proxyConfig.LocalPort) {
    return <>Unavailable</>
  }

  return currentProxyApp === proxyApp ? (
    <ButtonUnstyled onClick={stopProxy} style={{ textAlign: 'right' }}>
      Stop
    </ButtonUnstyled>
  ) : (
    <ButtonUnstyled
      onClick={() => startProxy(proxyConfig)}
      style={{ textAlign: 'right' }}
    >
      Start
    </ButtonUnstyled>
  )
}
