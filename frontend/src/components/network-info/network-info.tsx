import React from 'react'

import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import { useNetwork } from '../../contexts/network/network-context'
import {
  startProxyAction,
  stopProxyAction
} from '../../contexts/service/service-actions'
import { ProxyApp, useService } from '../../contexts/service/service-context'
import type { Network, ProxyDAppConfig } from '../../models/network'
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
      <Header>Wallet Service / DApps</Header>
      <ServicesTable config={config} />
      <Header>gRPC Nodes</Header>
      <NodeList items={config.api.grpc.hosts} />
      <Header>GraphQL Nodes</Header>
      <NodeList items={config.api.graphQl.hosts} />
      <Header>REST Nodes</Header>
      <NodeList items={config.api.rest.hosts} />
      <Header>Application Settings</Header>
      <table>
        <tbody>
          <tr>
            <th>Log level</th>
            <td data-testid='log-level'>{config.level}</td>
          </tr>
          <tr>
            <th>Token expiry</th>
            <td data-testid='token-expiry'>{config.tokenExpiry}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

interface ServicesTableProps {
  config: Network
}

function ServicesTable({ config }: ServicesTableProps) {
  return (
    <table>
      <tbody data-testid='services'>
        <tr>
          <th>Walelt Service URL</th>
          <td data-testid='service-url'>{`http://${config.host}:${config.port}`}</td>
        </tr>
        <tr>
          <th>
            Console{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.console.url || 'Not set'})
            </span>
          </th>
          <td data-testid='service-console'>
            <DAppProxyControl
              proxyApp={ProxyApp.Console}
              proxyConfig={config.console}
            />
          </td>
        </tr>
        <tr>
          <th>
            Token dApp{' '}
            <span style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}>
              ({config.tokenDApp.url || 'Not set'})
            </span>
          </th>
          <td data-testid='service-token'>
            <DAppProxyControl
              proxyApp={ProxyApp.TokenDApp}
              proxyConfig={config.tokenDApp}
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

    dispatch(startProxyAction(network, proxyApp, c.localPort))
  }

  function stopProxy() {
    if (!network || !config) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(stopProxyAction(network, config.port))
  }

  // Need both of these set to start the proxy! User has the ability to edit these and
  // they could be empty
  if (!proxyConfig.url || !proxyConfig.localPort) {
    return <>Unavailable</>
  }

  return currentProxyApp === proxyApp ? (
    <ButtonUnstyled onClick={stopProxy} style={{ textAlign: 'right' }}>
      Stop
    </ButtonUnstyled>
  ) : (
    <ButtonUnstyled
      data-testid='start'
      onClick={() => startProxy(proxyConfig)}
      style={{ textAlign: 'right' }}
    >
      Start
    </ButtonUnstyled>
  )
}
