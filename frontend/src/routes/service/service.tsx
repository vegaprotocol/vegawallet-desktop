import React from 'react'
import { StartService, StopService } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { setServiceAction } from '../../contexts/service/service-actions'
import { useService } from '../../contexts/service/service-context'

export function Service() {
  const {
    state: { network }
  } = useGlobal()
  const {
    state: { running },
    dispatch
  } = useService()

  async function start(withConsole: boolean) {
    if (!network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }
    try {
      // TODO:  @Valentin heres where StartService hangs
      const HACK_URL = withConsole ? 'http://127.0.0.1:1847' : ''
      dispatch(setServiceAction(true, HACK_URL))
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
      {running ? (
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
