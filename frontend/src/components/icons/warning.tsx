import React from 'react'

import { style as defaultStyle } from './style'

export function Warning({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox='0 0 16 16' style={{ ...defaultStyle, ...style }}>
      <path
        d='M15.84,13.5l0.01-0.01l-7-12L8.84,1.5c-0.17-0.3-0.48-0.5-0.85-0.5
			S7.32,1.2,7.14,1.5c0,0-0.01-0.01-0.01-0.01l-7,12l0.01,0.01c-0.09,0.15-0.15,0.31-0.15,0.5c0,0.55,0.45,1,1,1h14
			c0.55,0,1-0.45,1-1C15.99,13.81,15.93,13.65,15.84,13.5z M8.99,12.99h-2v-2h2V12.99z M8.99,9.99h-2v-5h2V9.99z'
      />
    </svg>
  )
}
