import React from 'react'
import { Service } from '../../app'

export const BackendContext = React.createContext<Service | undefined>(
  undefined
)

export function useBackend() {
  const context = React.useContext(BackendContext)
  if (context === undefined) {
    throw new Error('useService must be used within ServiceProvider')
  }
  return context
}
