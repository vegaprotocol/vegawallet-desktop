import React from 'react'

export function BreakText({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <span style={{ maxWidth: 200, wordBreak: 'break-word' }} {...rest}>{children}</span>
  )
}
