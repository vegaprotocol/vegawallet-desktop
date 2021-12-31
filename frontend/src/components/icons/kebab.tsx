import React from 'react'
import { style as defaultStyle } from './style'

export function Kebab({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox='0 0 16 16' style={{ ...defaultStyle, ...style }}>
      <g id='more_3_'>
        <circle cx='2' cy='8.03' r='2' />
        <circle cx='14' cy='8.03' r='2' />
        <circle cx='8' cy='8.03' r='2' />
      </g>
    </svg>
  )
}
