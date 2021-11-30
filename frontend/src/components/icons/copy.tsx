import React from 'react'

export function Copy({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className='icon' viewBox='0 0 11 11' style={style}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z'
      />
    </svg>
  )
}
