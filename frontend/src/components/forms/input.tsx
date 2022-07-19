import type { ForwardedRef, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { defaultStyles } from './styles'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(
  ({ style, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    return <input {...props} ref={ref} style={{ ...defaultStyles, ...style }} />
  }
)
