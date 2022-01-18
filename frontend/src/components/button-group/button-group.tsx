import React from 'react'

interface ButtonGroupProps {
  children: React.ReactNode
}

export function ButtonGroup({ children }: ButtonGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }}
      className='button-group'>
      {React.Children.map(children, child => {
        return React.cloneElement(child as any, {
          style: {
            flex: 1
          }
        })
      })}
    </div>
  )
}
