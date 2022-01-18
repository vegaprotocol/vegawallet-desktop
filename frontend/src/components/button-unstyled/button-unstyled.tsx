import React, { ButtonHTMLAttributes } from 'react'
import { Colors } from '../../config/colors'

const style: React.CSSProperties = {
  color: Colors.WHITE,
  fontSize: 16,
  cursor: 'pointer',
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
