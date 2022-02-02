import React from 'react'

interface Header {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const Header = ({ children, style }: Header) => {
  return (
    <h1
      style={{
        fontSize: 22,
        margin: '30px 0 10px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.3em',
        lineHeight: 1.2,
        ...style
      }}
    >
      {children}
    </h1>
  )
}
