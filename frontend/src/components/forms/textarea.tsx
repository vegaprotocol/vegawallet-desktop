import type { ForwardedRef, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { getDefaultStyles } from './styles'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef(
  (
    { style, ...props }: TextareaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <textarea
        {...props}
        ref={ref}
        style={{
          ...getDefaultStyles({ hasError: props['aria-invalid'] === 'true' }),
          minHeight: 200,
          resize: 'vertical',
          ...style
        }}
      />
    )
  }
)
