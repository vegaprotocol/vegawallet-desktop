import type { HTMLAttributes } from 'react'
import React from 'react'

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
        overflow: 'auto',
        ...style
      }}
    >
      {children}
    </code>
  )
}
