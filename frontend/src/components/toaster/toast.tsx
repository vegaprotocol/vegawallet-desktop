import './toast.scss'
import React from 'react'
import { Intent } from '../../config/intent'
import { IntentColors } from '../../config/colors'
import { ToastOptions } from '.'
import { ButtonUnstyled } from '../button-unstyled'

export interface ToastProps extends ToastOptions {
  onDismiss?: (toast: ToastOptions) => void
  timeout?: number
}

export function Toast({
  id,
  message,
  onDismiss,
  intent = Intent.NONE,
  timeout = 5000
}: ToastProps) {
  const timeoutRef = React.useRef<any>()

  const startTimeout = () => {
    cancelTimeout()
    timeoutRef.current = setTimeout(() => {
      dismiss()
    }, timeout)
  }

  const cancelTimeout = () => {
    clearTimeout(timeoutRef.current)
  }

  const dismiss = () => {
    cancelTimeout()
    if (typeof onDismiss === 'function') {
      onDismiss({ id, message, intent })
    }
  }

  React.useEffect(() => {
    startTimeout()
    return () => {
      cancelTimeout()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 5,
        borderRadius: 2,
        margin: '15px 0 0 0',
        padding: '10px 15px',
        background: IntentColors[intent],
        animation: 'drop .3s ease',
        animationFillMode: 'forwards'
      }}
      onBlur={startTimeout}
      onFocus={cancelTimeout}
      onMouseEnter={cancelTimeout}
      onMouseLeave={startTimeout}
      tabIndex={0}
      role='alert'>
      <span>{message}</span>
      <ButtonUnstyled onClick={dismiss}>X</ButtonUnstyled>
    </div>
  )
}
