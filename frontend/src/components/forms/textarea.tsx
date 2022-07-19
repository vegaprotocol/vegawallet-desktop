import type { ForwardedRef, TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { defaultStyles } from './styles'

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
          ...defaultStyles,
          minHeight: 200,
          resize: 'vertical',
          ...style
        }}
      />
    )
  }
)
