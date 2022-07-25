import React from 'react'

import { Colors, IntentColors } from '../../config/colors'
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
        margin: '0 0 8px 0',
        ...style
      }}
    >
      <label htmlFor={labelFor}>{label}</label>
      <div
        style={{
          position: 'relative',
          marginTop: 5,
          paddingBottom: 21
        }}
      >
        {children}
        {helperText && (
          <div
            data-testid='helper-text'
            style={{
              marginTop: 5,
              fontSize: 14,
              color:
                // if no intent is provided, use deemphasises text to help visual hierarchy
                intent === 'none'
                  ? Colors.TEXT_COLOR_DEEMPHASISE
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
