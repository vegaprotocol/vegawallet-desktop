import React from 'react'

import { style as defaultStyle } from './style'

export function ChevronLeft({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox='0 0 16 16' style={{ ...defaultStyle, ...style }}>
      <path
        d='M7.41,8l3.29-3.29C10.89,4.53,11,4.28,11,4c0-0.55-0.45-1-1-1
			C9.72,3,9.47,3.11,9.29,3.29l-4,4C5.11,7.47,5,7.72,5,8c0,0.28,0.11,0.53,0.29,0.71l4,4C9.47,12.89,9.72,13,10,13
			c0.55,0,1-0.45,1-1c0-0.28-0.11-0.53-0.29-0.71L7.41,8z'
      />
    </svg>
  )
}
