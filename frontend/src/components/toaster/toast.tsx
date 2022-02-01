import './toast.css'
import React from 'react'
import { Intent } from '../../config/intent'
import { IntentBackgrounds, Colors } from '../../config/colors'
import { Toast as IToast } from '.'
import { ButtonUnstyled } from '../button-unstyled'
import { Cross } from '../icons/cross'

export interface ToastProps {
  id: string
  message: React.ReactNode
  onDismiss: (toast: IToast) => void
  intent?: Intent
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
      onDismiss({ id, message, intent, timeout })
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
        background: Colors.BLACK,
        borderRadius: 2,
        maxWidth: '90vw',
        margin: '15px 0 0 0',
        overflow: 'hidden',
        animation: 'drop .3s ease',
        animationFillMode: 'forwards'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          padding: '5px 15px',
          background: IntentBackgrounds[intent]
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
          style={{ position: 'relative', top: -5, right: -15 }}
        >
          <Cross style={{ width: 40, height: 40 }} />
        </ButtonUnstyled>
      </div>
    </div>
  )
}
