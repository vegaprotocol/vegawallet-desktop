import React from 'react'

export function BreakText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ maxWidth: 200, wordBreak: 'break-word' }}>{children}</span>
  )
}
