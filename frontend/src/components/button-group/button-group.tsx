import type { HTMLAttributes } from 'react'
import React from 'react'

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  inline?: boolean
}

const getItemStyles = (isInline?: boolean) =>
  isInline
    ? undefined
    : {
        flexGrow: 1,
        flexBasis: 0
      }

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  inline,
  style,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      {...props}
      style={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        alignItems: orientation === 'horizontal' ? 'center' : undefined,
        gap: 20,
        ...style
      }}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const styles = getItemStyles(inline)
          return React.cloneElement(child, {
            style: {
              ...styles,
              ...child.props.style
            }
          })
        }

        return null
      })}
    </div>
  )
}
