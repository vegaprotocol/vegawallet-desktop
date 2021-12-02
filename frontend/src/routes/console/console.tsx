import React from 'react'
import { GetConsoleState, StartConsole, StopConsole } from '../../api/service'
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
    try {
      // TODO: figure out why this isn't working
      const res = await StartConsole({ Network: 'foo' })
    } catch (err) {
      console.error(err)
    }
  }

  async function stop() {
    try {
      await StopConsole()
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
          Start Console
        </button>
      ) : (
        <button onClick={start} type='button'>
          Start Console
        </button>
      )}
    </div>
  )
}
