import React from 'react'
import { Colors } from '../../config/colors'

interface CodeBlockProps {
  children: React.ReactNode
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <code
      style={{
        display: 'block',
        fontFamily: '"Roboto Mono", monospace',
        padding: '10px 30px 10px 15px',
        background: Colors.DARK_GRAY_2
      }}>
      {children}
    </code>
  )
}
