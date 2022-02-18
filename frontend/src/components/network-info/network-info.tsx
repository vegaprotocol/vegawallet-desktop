import React from 'react'

import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import {
  startProxyAction,
  stopProxyAction
} from '../../contexts/network/network-actions'
import type { ProxyApp } from '../../contexts/network/network-context'
import { useNetwork } from '../../contexts/network/network-context'
import type {
  ConsoleConfig,
  Network,
  TokenDAppConfig
} from '../../wailsjs/go/models'
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
  const {
    state: { console, tokenDapp }
  } = useNetwork()

  return (
    <table>
      <tbody data-testid='services'>
        <tr>
          <th>Wallet Service URL</th>
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
            <DAppProxyControl proxyApp={console} proxyConfig={config.console} />
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
              proxyApp={tokenDapp}
              proxyConfig={config.tokenDApp}
            />
          </td>
        </tr>
      </tbody>
    </table>
  )
}

interface DAppProxyControlProps {
  proxyConfig: ConsoleConfig | TokenDAppConfig
  proxyApp: ProxyApp
}

function DAppProxyControl({ proxyConfig, proxyApp }: DAppProxyControlProps) {
  const {
    dispatch,
    state: { config, network }
  } = useNetwork()

  function startProxy() {
    if (!network || !config) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(
      startProxyAction(
        network,
        proxyApp.name,
        `http://${config.host}:${proxyConfig.localPort}`
      )
    )
  }

  function stopProxy() {
    dispatch(stopProxyAction(proxyApp.name))
  }

  // Need both of these set to start the proxy! User has the ability to edit these and
  // they could be empty
  if (!proxyConfig.url || !proxyConfig.localPort) {
    return <>Unavailable</>
  }

  return proxyApp.running ? (
    <ButtonUnstyled onClick={stopProxy} style={{ textAlign: 'right' }}>
      Stop
    </ButtonUnstyled>
  ) : (
    <ButtonUnstyled
      data-testid='start'
      onClick={startProxy}
      style={{ textAlign: 'right' }}
    >
      Start
    </ButtonUnstyled>
  )
}
