import React from 'react'
import { StartService, StopService } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { setServiceAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'

export function Service() {
  const { state, dispatch } = useGlobal()

  async function start(withConsole: boolean) {
    if (!state.network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }
    try {
      // TODO: Move this to use response of StartService. Currently the promise never resolves
      const HACK_URL = withConsole ? 'http://127.0.0.1:1847' : ''
      dispatch(setServiceAction(true, HACK_URL))
      await StartService({
        network: state.network,
        withConsole
      })
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopService()
      dispatch(setServiceAction(false, ''))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
      }}>
      {state.serviceRunning ? (
        <button onClick={stop} type='button'>
          Stop service
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <button onClick={() => start(false)} type='button'>
            Start service
          </button>
          <button onClick={() => start(true)} type='button'>
            Start service with Console proxy
          </button>
        </div>
      )}
    </div>
  )
}
