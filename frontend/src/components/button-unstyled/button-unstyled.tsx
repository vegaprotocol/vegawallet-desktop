import React, { ButtonHTMLAttributes, ForwardedRef } from 'react'
import { Colors } from '../../config/colors'

const style: React.CSSProperties = {
  color: Colors.WHITE,
  fontSize: 16,
  cursor: 'pointer',
  appearance: 'none',
  border: 0,
  background: 'transparent',
  padding: 0,
  textDecoration: 'underline'
}

export const ButtonUnstyled = React.forwardRef(
  (
    props: ButtonHTMLAttributes<HTMLButtonElement>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button
        type='button'
        ref={ref}
        {...props}
        style={{ ...style, ...props.style }}
      />
    )
  }
)
