import './spinner.css'
import React from 'react'

export function Spinner() {
  return (
    <svg
      width='20'
      height='20'
      strokeWidth='10'
      viewBox='0 0 50 50'
      style={{
        width: 24,
        height: 24,
        animation: 'rotate 2s linear infinite',
        display: 'block'
      }}
    >
      <circle
        style={{
          stroke: 'currentcolor',
          strokeLinecap: 'square',
          animation: 'dash 1.5s ease-in-out infinite'
        }}
        cx='25'
        cy='25'
        r='20'
        fill='none'
        strokeWidth='5'
      />
    </svg>
  )
}
