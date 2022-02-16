import React from 'react'

import { style as defaultStyle } from './style'

export function Copy({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox='0 0 11 11' style={{ ...defaultStyle, ...style }}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z'
      />
    </svg>
  )
}
