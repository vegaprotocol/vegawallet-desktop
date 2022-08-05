import type { ForwardedRef, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { getDefaultStyles } from './styles'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(
  (
    { style, type = 'text', ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        {...props}
        type={type}
        ref={ref}
        style={{
          ...getDefaultStyles({ hasError: props['aria-invalid'] === 'true' }),
          ...style
        }}
      />
    )
  }
)
