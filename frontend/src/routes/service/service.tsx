import React from 'react'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useNetwork } from '../../contexts/network/network-context'
import {
  startProxyAction,
  startServiceAction,
  stopServiceAction
} from '../../contexts/service/service-actions'
import { ProxyApp, useService } from '../../contexts/service/service-context'

export function Service() {
  const {
    state: { network }
  } = useNetwork()
  const {
    state: { serviceRunning, proxy },
    dispatch
  } = useService()

  function start() {
    if (!network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }

    dispatch(startServiceAction(network))
  }

  function stop() {
    dispatch(stopServiceAction())
  }

  function startProxy(app: ProxyApp) {
    if (!network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }

    dispatch(startProxyAction(network, app))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
        gap: 15
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {serviceRunning ? (
          <button onClick={stop} type='button'>
            Stop service
          </button>
        ) : (
          <button onClick={() => start()} type='button'>
            Start service
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {proxy === ProxyApp.Console ? (
          <button onClick={stop} type='button'>
            Stop Console
          </button>
        ) : (
          <button onClick={() => startProxy(ProxyApp.Console)} type='button'>
            Start service with Console proxy
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {proxy === ProxyApp.TokenDApp ? (
          <button onClick={stop} type='button'>
            Stop Token dApp
          </button>
        ) : (
          <button onClick={() => startProxy(ProxyApp.TokenDApp)} type='button'>
            Start service with Token dApp proxy
          </button>
        )}
      </div>
    </div>
  )
}
