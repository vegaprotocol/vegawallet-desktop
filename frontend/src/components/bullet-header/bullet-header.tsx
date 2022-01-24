import React from 'react'

interface Header {
  children: React.ReactNode
}

export const Header = ({ children }: Header) => {
  return (
    <h1
      style={{
        fontSize: 22,
        margin: '2px 0 0 0',
        padding: '0 0 25px',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        lineHeight: 1.2
      }}>
      {children}
    </h1>
  )
}
