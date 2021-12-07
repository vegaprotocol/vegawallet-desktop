import React from 'react'
import { StartService, StopService } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import {
  startConsoleAction,
  startServiceAction,
  stopServiceAction
} from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'

export function Service() {
  const {
    state: { network }
  } = useGlobal()
  const {
    state: { serviceRunning, consoleRunning },
    dispatch
  } = useService()

  async function start(withConsole: boolean) {
    if (!network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }
    try {
      dispatch(startServiceAction())
      await StartService({
        network,
        withConsole
      })
      console.log('after')
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopService()
      dispatch(stopServiceAction())
    } catch (err) {
      console.error(err)
    }
  }

  async function startConsole() {
    if (!network) return
    try {
      await StopService()
      dispatch(startConsoleAction())
      await StartService({ network, withConsole: true })
    } catch (err) {
      console.error(err)
    }
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
          <button onClick={() => start(false)} type='button'>
            Start service
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
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
    </div>
  )
}
