import React from 'react'
import { Button } from '../../components/button'
import { AppToaster } from '../../components/toaster'
import { Intent } from '../../config/intent'
import { useNetwork } from '../../contexts/network/network-context'
import {
  startProxyAction,
  startServiceAction,
  stopServiceAction
} from '../../contexts/service/service-actions'
import { ProxyApp, useService } from '../../contexts/service/service-context'

export function Service() {
  const {
    state: { network, config }
  } = useNetwork()
  const {
    state: { serviceRunning, proxy },
    dispatch
  } = useService()

  function start() {
    if (!network || !config) {
      AppToaster.show({
        message: 'No network config found',
        intent: Intent.DANGER
      })
      return
    }

    dispatch(startServiceAction(network, config.Port))
  }

  function stop() {
    dispatch(stopServiceAction())
  }

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
        gap: 15
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {serviceRunning ? (
          <Button onClick={stop}>Stop service</Button>
        ) : (
          <Button onClick={start}>Start service</Button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {proxy === ProxyApp.Console ? (
          <Button onClick={stop}>Stop Console</Button>
        ) : (
          <Button onClick={() => startProxy(ProxyApp.Console)}>
            Start service with Console
          </Button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {proxy === ProxyApp.TokenDApp ? (
          <Button onClick={stop}>Stop Token dApp</Button>
        ) : (
          <Button onClick={() => startProxy(ProxyApp.TokenDApp)}>
            Start service with Token dApp
          </Button>
        )}
      </div>
    </div>
  )
}
