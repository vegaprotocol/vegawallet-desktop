import React from 'react'

import { style as defaultStyle } from './style'

export function DropdownArrow({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      style={{ ...defaultStyle, fill: 'transparent', ...style }}
      viewBox='0 0 13 14'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6.52734 0.651855L6.52734 12.216'
        stroke='currentColor'
        strokeWidth='1.3'
        strokeMiterlimit='10'
      />
      <path
        d='M11.9998 6.95996L6.49988 12.6035L1 6.95996'
        stroke='currentColor'
        strokeWidth='1.3'
        strokeMiterlimit='10'
      />
    </svg>
  )
}
