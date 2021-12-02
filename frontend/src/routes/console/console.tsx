import React from 'react'
import { GetServiceState, StartService, StopService } from '../../api/service'
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
    try {
      const res = await StartService({ Network: state.network })
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopService()
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
