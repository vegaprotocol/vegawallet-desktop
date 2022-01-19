import React from 'react'
import { Service } from '../../app'
import { BackendContext } from './backend-context'

interface BackendProviderProps {
  children: React.ReactElement
  service: Service
}

export function BackendProvider({ children, service }: BackendProviderProps) {
  return (
    <BackendContext.Provider value={service}>
      {children}
    </BackendContext.Provider>
  )
}
