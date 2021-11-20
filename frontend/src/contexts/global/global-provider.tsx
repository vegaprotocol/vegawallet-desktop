import React from 'react'
import { GlobalContext } from './global-context'
import { globalReducer, initialGlobalState } from './global-reducer'

interface GlobalProviderProps {
  children: React.ReactElement
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = React.useReducer(globalReducer, initialGlobalState)
  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  )
}
