import React from 'react'

import { style as defaultStyle } from './style'

export function ArrowTopRight({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={{ ...defaultStyle, ...style }} viewBox='0 0 10 10'>
      <path d='M7.30117 1.32961L1.05914 1.4101L1.04237 0.11021L8.92199 0.00860043L9.58891 0L9.58031 0.666927L9.47871 8.54654L8.17881 8.52978L8.26032 2.20894L0.919239 9.55002L0 8.63078L7.30117 1.32961Z'></path>
    </svg>
  )
}
