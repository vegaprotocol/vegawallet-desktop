import React from 'react'
import { Colors } from '../../config/colors'

export const FormGroup = ({
  children,
  label,
  labelFor,
  errorText
}: {
  children: React.ReactNode
  label?: string
  labelFor?: string
  errorText?: string
}) => {
  return (
    <div style={{ marginBottom: 25 }}>
      {label && (
        <label
          htmlFor={labelFor}
          style={{ display: 'block', fontSize: 16, marginBottom: 8 }}>
          {label}
        </label>
      )}
      <div>{children}</div>
      {errorText && (
        <div style={{ fontSize: 14, marginTop: 8, color: Colors.RED }}>
          {errorText}
        </div>
      )}
    </div>
  )
}
