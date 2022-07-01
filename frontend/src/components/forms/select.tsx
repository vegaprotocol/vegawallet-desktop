import type { ForwardedRef, SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'

import { Colors } from '../../config/colors'
import { defaultStyles } from './styles'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

const CARET_SIZE = 5

export const Select = forwardRef(
  ({ style, ...props }: SelectProps, ref: ForwardedRef<HTMLSelectElement>) => {
    return (
      <div style={{ position: 'relative' }}>
        <select
          {...props}
          ref={ref}
          style={{
            ...defaultStyles,
            ...style,
            paddingRight: 20
          }}
        />
        <span
          style={{
            position: 'absolute',
            display: 'block',
            top: `calc(50% - ${CARET_SIZE / 2}px)`,
            right: 10,
            width: 0,
            height: 0,
            borderTop: `${CARET_SIZE}px solid ${Colors.WHITE}`,
            borderRight: `${CARET_SIZE}px solid transparent`,
            borderLeft: `${CARET_SIZE}px solid transparent`
          }}
        />
      </div>
    )
  }
)
