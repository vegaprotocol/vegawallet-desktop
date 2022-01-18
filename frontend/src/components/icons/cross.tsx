import React from 'react'
import { style as defaultStyle } from './style'

export function Cross({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox='0 0 16 16' style={{ ...defaultStyle, ...style }}>
      <path
        d='M9.41,8l3.29-3.29C12.89,4.53,13,4.28,13,4c0-0.55-0.45-1-1-1
			c-0.28,0-0.53,0.11-0.71,0.29L8,6.59L4.71,3.29C4.53,3.11,4.28,3,4,3C3.45,3,3,3.45,3,4c0,0.28,0.11,0.53,0.29,0.71L6.59,8
			l-3.29,3.29C3.11,11.47,3,11.72,3,12c0,0.55,0.45,1,1,1c0.28,0,0.53-0.11,0.71-0.29L8,9.41l3.29,3.29C11.47,12.89,11.72,13,12,13
			c0.55,0,1-0.45,1-1c0-0.28-0.11-0.53-0.29-0.71L9.41,8z'
      />
    </svg>
  )
}
