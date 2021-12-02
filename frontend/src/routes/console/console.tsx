import React from 'react'
import { GetConsoleState, StartConsole, StopConsole } from '../../api/service'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { GetConsoleStateResponse } from '../../models/console-state'

export function Console() {
  const { state } = useGlobal()
  const [status, setStatus] = React.useState<GetConsoleStateResponse | null>(
    null
  )

  React.useEffect(() => {
    async function run() {
      const status = await GetConsoleState()
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
      const res = await StartConsole({ Network: state.network })
      // @ts-ignore
      setStatus(curr => ({ ...curr, Running: res }))
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopConsole()
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
