import './button-group.scss'
import React from 'react'

interface ButtonGroupProps {
  children: React.ReactNode
}

export function ButtonGroup({ children }: ButtonGroupProps) {
  return <div className='button-group'>{children}</div>
}
