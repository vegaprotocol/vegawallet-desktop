import './toast.css'
import React from 'react'
import { Intent } from '../../config/intent'
import { IntentColors } from '../../config/colors'
import { ToastOptions } from '.'
import { ButtonUnstyled } from '../button-unstyled'
import { Cross } from '../icons/cross'

export interface ToastProps extends ToastOptions {
  onDismiss?: (toast: ToastOptions) => void
  timeout?: number
}

export function Toast({
  id,
  message,
  onDismiss,
  intent = Intent.NONE,
  timeout = 3000
}: ToastProps) {
  const timeoutRef = React.useRef<any>()

  const startTimeout = () => {
    if (timeout && timeout > 0) {
      cancelTimeout()
      timeoutRef.current = setTimeout(() => {
        dismiss()
      }, timeout)
    }
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
        alignItems: 'center',
        gap: 10,
        borderRadius: 2,
        maxWidth: '90vw',
        margin: '15px 0 0 0',
        padding: '5px 15px',
        background: IntentColors[intent],
        animation: 'drop .3s ease',
        animationFillMode: 'forwards'
      }}
      onBlur={startTimeout}
      onFocus={cancelTimeout}
      onMouseEnter={cancelTimeout}
      onMouseLeave={startTimeout}
      tabIndex={0}
      role='alert'
    >
      <span style={{ wordBreak: 'break-word' }}>{message}</span>
      <ButtonUnstyled
        onClick={dismiss}
        style={{ position: 'relative', top: -10, right: -15 }}
      >
        <Cross style={{ width: 40, height: 40 }} />
      </ButtonUnstyled>
    </div>
  )
}
