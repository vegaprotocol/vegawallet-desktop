import React from 'react'
import { Colors } from '../../config/colors'

interface Header {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const Header = ({ children, style }: Header) => {
  return (
    <h1
      style={{
        fontSize: 15,
        color: Colors.TEXT_COLOR_DEEMPHASISE,
        margin: '30px 0 20px 0',
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
