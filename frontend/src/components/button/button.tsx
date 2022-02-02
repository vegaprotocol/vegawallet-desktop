import React, { ButtonHTMLAttributes, ForwardedRef } from 'react'
import { Colors } from '../../config/colors'

const style: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${Colors.WHITE}`,
  borderRadius: 0,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontSize: 16,
  padding: '7px 17px',
  textTransform: 'uppercase',
  minWidth: 145
}

export const Button = React.forwardRef(
  (
    props: ButtonHTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        type='button'
        {...props}
        style={{ ...style, ...props.style }}
      />
    )
  }
)
