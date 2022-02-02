import React, { HTMLAttributes } from 'react'
import { Colors } from '../../config/colors'

interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CodeBlock({ children, style, ...props }: CodeBlockProps) {
  return (
    <code
      {...props}
      style={{
        display: 'block',
        fontFamily: '"Roboto Mono", monospace',
        padding: '10px 30px 10px 15px',
        background: Colors.DARK_GRAY_2,
        ...style
      }}
    >
      {children}
    </code>
  )
}
