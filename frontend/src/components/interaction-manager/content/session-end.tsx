import { useEffect } from 'react'
import type { SessionEnded, InteractionContentProps } from '../types'

export const SessionEndComponent = ({ onFinish }: InteractionContentProps<SessionEnded>) => {
  useEffect(() => {
    onFinish()
  }, [])

  return null
}
