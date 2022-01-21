import './callout.css'
import React from 'react'
import { IntentBackgrounds } from '../../config/colors'
import { Intent } from '../../config/intent'

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactElement
  title?: string
  icon?: React.ReactNode
  intent?: Intent
}

export function Callout({
  children,
  title,
  icon,
  intent = Intent.NONE,
  style,
  ...htmlProps
}: CalloutProps) {
  const defaultStyle = {
    display: 'flex',
    gap: 15,
    background: IntentBackgrounds[intent],
    padding: '15px 20px',
    marginBottom: 15
  }
  return (
    <div style={{ ...defaultStyle, ...style }} {...htmlProps}>
      {icon && <span>{icon}</span>}
      <div className='callout__content'>
        <h4 style={{ marginTop: 0 }}>{title}</h4>
        {children}
      </div>
    </div>
  )
}
