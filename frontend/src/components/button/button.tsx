import React, { ButtonHTMLAttributes, ForwardedRef } from 'react'
import { Colors } from '../../config/colors'

const style: React.CSSProperties = {
  background: Colors.DARK_GRAY_1,
  border: `1px solid ${Colors.DARK_GRAY_3}`,
  borderRadius: 2,
  color: Colors.WHITE,
  cursor: 'pointer',
  fontSize: 16,
  padding: '7px 17px'
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
