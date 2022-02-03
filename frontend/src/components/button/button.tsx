import React, { ButtonHTMLAttributes, ForwardedRef } from 'react'
import { Colors } from '../../config/colors'
import { Spinner } from '../spinner'

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
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export const Button = React.forwardRef(
  (
    { children, loading, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const renderChildren = () => {
      if (loading) {
        return <Spinner />
      }

      return children
    }

    return (
      <button
        ref={ref}
        type='button'
        {...props}
        disabled={loading ? true : props.disabled}
        style={{ ...style, ...props.style }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5
          }}
        >
          {renderChildren()}
        </span>
      </button>
    )
  }
)
