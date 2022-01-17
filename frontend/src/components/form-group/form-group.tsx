import React from 'react'
import { Intent } from '../../config/intent'

interface FormGroupProps {
  children: React.ReactNode
  label?: React.ReactNode
  labelFor?: string
  helperText?: React.ReactNode
  intent?: Intent
  className?: string
  style?: React.CSSProperties
}

export function FormGroup({
  children,
  label,
  labelFor,
  helperText,
  style
}: FormGroupProps) {
  return (
    <div style={style}>
      <label htmlFor={labelFor}>{label}</label>
      <div>
        {children}
        {helperText && <div>{helperText}</div>}
      </div>
    </div>
  )
}
