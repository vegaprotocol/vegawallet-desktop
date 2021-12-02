import React from 'react'
import { StartService, StopService } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'

export function Console() {
  const { state, dispatch } = useGlobal()

  async function start() {
    if (!state.network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }
    try {
      // TODO: Move this to use response of StartService. Currently the promise never resolves
      const HACK_URL = 'http://127.0.0.1:1847'
      dispatch({ type: 'SET_SERVICE', running: true, url: HACK_URL })
      await StartService({
        network: state.network,
        withConsole: true
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopService()
      dispatch({ type: 'SET_SERVICE', running: false, url: '' })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {state.serviceRunning ? (
        <button onClick={stop} type='button'>
          Stop Console
        </button>
      ) : (
        <button onClick={start} type='button'>
          Start Console
        </button>
      )}
    </div>
  )
}
