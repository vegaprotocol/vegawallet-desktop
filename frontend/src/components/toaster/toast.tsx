import './toast.scss'
import React from 'react'

export const Toast = ({
  id,
  message,
  onDismiss,
  color = 'purple'
}: {
  id: string
  message: string
  onDismiss: (key: string) => void
  color?: string
}) => {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onDismiss(id)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [id, onDismiss])

  return (
    <div
      role='alert'
      style={{
        padding: '10px 20px',
        background: color,
        color: 'black',
        minWidth: 200,
        marginTop: 20,
        borderRadius: 2,
        animation: 'drop 0.3s ease',
        animationFillMode: 'forwards',
        transform: 'translateY(-100%)'
      }}>
      {message}
    </div>
  )
}
