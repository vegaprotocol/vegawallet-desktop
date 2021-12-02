import React from 'react'
import { GetServiceState, StartService, StopService } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { GetServiceStateResponse } from '../../models/console-state'

export function Console() {
  const { state } = useGlobal()
  const [status, setStatus] = React.useState<GetServiceStateResponse | null>(
    null
  )

  React.useEffect(() => {
    async function run() {
      const status = await GetServiceState()
      setStatus(status)
    }
    run()
  }, [])

  async function start() {
    if (!state.network) {
      AppToaster.show({ message: 'No network selected', color: Colors.RED })
      return
    }
    try {
      // TODO: Move this to use response of StartService. Currently the promise never resolves
      // @ts-ignore
      setStatus(curr => ({ ...curr, Running: true }))
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
      // @ts-ignore
      setStatus(curr => ({ ...curr, Running: false }))
    } catch (err) {
      console.error(err)
    }
  }

  if (status === null) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {status?.Running ? (
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
