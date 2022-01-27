import React from 'react'

interface ButtonGroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export function ButtonGroup({
  children,
  orientation = 'horizontal'
}: ButtonGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: 10
      }}
    >
      {React.Children.map(children, child => {
        return React.cloneElement(child as any, {
          style: {
            flexGrow: 1,
            flexBasis: 0
          }
        })
      })}
    </div>
  )
}
