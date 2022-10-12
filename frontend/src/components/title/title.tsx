import type { HTMLAttributes } from 'react'
import React from 'react'

import { Colors } from '../../config/colors'

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  element?: 'h1' | 'h2' | 'h3' | 'h4'
}

const titleStyles = {
  fontSize: 15,
  color: Colors.TEXT_COLOR_DEEMPHASISE,
  margin: '30px 0 20px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  lineHeight: 1.2
} as React.CSSProperties

export const Title = ({ children, style, ...rest }: HeaderProps) => {
  return (
    <h1
      {...rest}
      style={{
        ...titleStyles,
        ...style
      }}
    >
      {children}
    </h1>
  )
}
