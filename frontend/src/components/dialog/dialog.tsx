import './dialog.css'

import * as DialogPrimitives from '@radix-ui/react-dialog'
import * as React from 'react'

interface DialogProps {
  open: boolean
  children: React.ReactElement
}

export function Dialog({ open, children }: DialogProps) {
  return (
    <DialogPrimitives.Root open={open}>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            background: 'rgba(54, 54, 54 ,0.8)',
            animation: 'fade-in .2s ease',
            animationFillMode: 'forwards'
          }}
        />
        <DialogPrimitives.Content
          style={{
            padding: 20,
            background: 'black',
            width: 340,
            position: 'fixed',
            top: 30,
            left: 'calc(50% - 170px)',
            boxShadow: '3px 3px 5px rgb(0,0,0,0.3)',
            animation: 'fade-in .2s ease',
            animationFillMode: 'forwards'
          }}
        >
          {children}
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  )
}
