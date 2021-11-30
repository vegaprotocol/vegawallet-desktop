import React, { ButtonHTMLAttributes } from 'react'

const style: React.CSSProperties = {
  appearance: 'none',
  border: 0,
  background: 'transparent',
  padding: 0
}

export function ButtonUnstyled(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type='button' {...props} style={{ ...style, ...props.style }} />
  )
}
