import React from 'react'
import {AppToaster} from '../../components/toaster'
import {Colors} from '../../config/colors'
import {useGlobal} from '../../contexts/global/global-context'
import {
  startConsoleAction,
  startServiceAction,
  startTokenDAppAction,
  stopServiceAction
} from '../../contexts/service/service-actions'
import {useService} from '../../contexts/service/service-context'

export function Service() {
  const {
    state: {network}
  } = useGlobal()
  const {
    state: {serviceRunning, consoleRunning, tokenDAppRunning},
    dispatch
  } = useService()

  async function start() {
    if (!network) {
      AppToaster.show({message: 'No network selected', color: Colors.RED})
      return
    }

    dispatch(startServiceAction(network))
  }

  function stop() {
    dispatch(stopServiceAction())
  }

  function startConsole() {
    if (!network) {
      AppToaster.show({message: 'No network selected', color: Colors.RED})
      return
    }

    dispatch(startConsoleAction(network))
  }

  function startTokenDApp() {
    if (!network) {
      AppToaster.show({message: 'No network selected', color: Colors.RED})
      return
    }

    dispatch(startTokenDAppAction(network))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
        gap: 15
      }}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
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
      <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
        {consoleRunning ? (
          <button onClick={stop} type='button'>
            Stop Console
          </button>
        ) : (
          <button onClick={() => startConsole()} type='button'>
            Start service with Console proxy
          </button>
        )}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
        {tokenDAppRunning ? (
          <button onClick={stop} type='button'>
            Stop Token dApp
          </button>
        ) : (
          <button onClick={() => startTokenDApp()} type='button'>
            Start service with Token dApp proxy
          </button>
        )}
      </div>
    </div>
  )
}
