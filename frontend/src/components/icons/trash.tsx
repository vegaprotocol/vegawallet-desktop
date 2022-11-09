import React from 'react'

import { style as defaultStyle } from './style'

export function Trash({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      style={{ ...defaultStyle, fill: 'currentColor', ...style }}
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.49,3.99h-13c-0.28,0-0.5,0.22-0.5,0.5s0.22,0.5,0.5,0.5h0.5v10
          c0,0.55,0.45,1,1,1h10c0.55,0,1-0.45,1-1v-10h0.5c0.28,0,0.5-0.22,0.5-0.5S14.77,3.99,14.49,3.99z M5.99,12.99c0,0.55-0.45,1-1,1
          s-1-0.45-1-1v-6c0-0.55,0.45-1,1-1s1,0.45,1,1V12.99z M8.99,12.99c0,0.55-0.45,1-1,1s-1-0.45-1-1v-6c0-0.55,0.45-1,1-1s1,0.45,1,1
          V12.99z M11.99,12.99c0,0.55-0.45,1-1,1s-1-0.45-1-1v-6c0-0.55,0.45-1,1-1s1,0.45,1,1V12.99z M13.99,0.99h-4c0-0.55-0.45-1-1-1h-2
          c-0.55,0-1,0.45-1,1h-4c-0.55,0-1,0.45-1,1v1h14v-1C14.99,1.44,14.54,0.99,13.99,0.99z'
      />
    </svg>
  )
}
