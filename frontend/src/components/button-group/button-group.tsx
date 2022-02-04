import React, { HTMLAttributes } from 'react'

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  style,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: 10,
        ...style
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
