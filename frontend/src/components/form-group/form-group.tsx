import React from 'react'
import { IntentColors } from '../../config/colors'
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
  style,
  intent = Intent.NONE
}: FormGroupProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 0 20px 0',
        ...style
      }}
    >
      <label htmlFor={labelFor}>{label}</label>
      <div
        style={{
          marginTop: 5
        }}
      >
        {children}
        {helperText && (
          <div
            style={{
              marginTop: 5,
              fontSize: 14,
              color:
                // if no intent is provided, use deemphasises text to help visual hierarchy
                intent === 'none'
                  ? 'var(--text-color-deemphasise)'
                  : IntentColors[intent]
            }}
          >
            {helperText}
          </div>
        )}
      </div>
    </div>
  )
}
