import React from 'react'

import { style as defaultStyle } from './style'

export function Cross({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={{ ...defaultStyle, ...style }} viewBox='0 0 45 45'>
      <path d='M14 14L30 30' stroke='currentColor' strokeWidth='1.3'></path>
      <path d='M30 14L14 30' stroke='currentColor' strokeWidth='1.3'></path>
    </svg>
  )
}
