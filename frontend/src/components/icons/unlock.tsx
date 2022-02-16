import React from 'react'

import { style as defaultStyle } from './style'

export function Unlock({ style }: { style?: React.CSSProperties }) {
  return (
    <svg data-testid='unlocked-icon' style={{ ...defaultStyle, ...style }} viewBox='0 0 16 16'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.99-0.01c-2.21,0-4,1.79-4,4v3h-7c-0.55,0-1,0.45-1,1v7c0,0.55,0.45,1,1,1h12
			c0.55,0,1-0.45,1-1v-7c0-0.55-0.45-1-1-1h-3v-3c0-1.1,0.9-2,2-2s2,0.9,2,2v1c0,0.55,0.45,1,1,1s1-0.45,1-1v-1
			C15.99,1.78,14.2-0.01,11.99-0.01z'
      />
    </svg>
  )
}
