import React from 'react'

import { Colors } from '../../config/colors'
import { Intent } from '../../config/intent'
import {
  startProxyAction,
  stopProxyAction
} from '../../contexts/global/global-actions'
import type { ProxyApp } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import type { network as NetworkModel } from '../../wailsjs/go/models'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
import { KeyValueTable } from '../key-value-table'
import { NodeList } from '../node-list'
import { AppToaster } from '../toaster'

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
      <ServicesTable config={config} />
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

interface ServicesTableProps {
  config: NetworkModel.Network
}

function ServicesTable({ config }: ServicesTableProps) {
  const {
    state: { console, tokenDapp }
  } = useGlobal()

  return (
    <KeyValueTable
      style={{ fontSize: 16 }}
      rows={[
        {
          key: 'Wallet Service URL',
          value: `http://${config.host}:${config.port}`,
          dataTestId: 'service-url'
        },
        {
          key: (
            <>
              Console{' '}
              <span
                data-testid='console-url'
                style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}
              >
                ({config.console.url || 'Endpoint not configured'})
              </span>
            </>
          ),
          value: (
            <DAppProxyControl proxyApp={console} proxyConfig={config.console} />
          ),
          dataTestId: 'service-console'
        },
        {
          key: (
            <>
              Token dApp{' '}
              <span
                data-testid='token-url'
                style={{ color: Colors.TEXT_COLOR_DEEMPHASISE }}
              >
                ({config.tokenDApp.url || 'Endpoint not configured'})
              </span>
            </>
          ),
          value: (
            <DAppProxyControl
              proxyApp={tokenDapp}
              proxyConfig={config.tokenDApp}
            />
          ),
          dataTestId: 'service-token'
        }
      ]}
      data-testid='services'
    />
  )
}

interface DAppProxyControlProps {
  proxyConfig: NetworkModel.ConsoleConfig | NetworkModel.TokenDAppConfig
  proxyApp: ProxyApp
}

function DAppProxyControl({ proxyConfig, proxyApp }: DAppProxyControlProps) {
  const {
    dispatch,
    state: { networkConfig: config, network }
  } = useGlobal()

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
