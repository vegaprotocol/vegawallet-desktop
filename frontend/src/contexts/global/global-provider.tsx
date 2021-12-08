import React from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { GlobalContext } from './global-context'
import { globalReducer, initialGlobalState } from './global-reducer'

interface GlobalProviderProps {
  children: React.ReactElement
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useThunkReducer(globalReducer, initialGlobalState)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}
