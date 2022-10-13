import * as DialogPrimitives from '@radix-ui/react-dialog'
import * as React from 'react'
import { animated, config, useTransition } from 'react-spring'

import { Colors } from '../../config/colors'
import { Title } from '../title'

interface DialogProps {
  open: boolean
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'lg'
  onChange?: (open: boolean) => void
}

export function Dialog({
  open,
  title,
  children,
  onChange,
  size = 'sm'
}: DialogProps) {
  const transitions = useTransition(open, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -10 },
    config: { ...config.default, duration: 170 }
  })
  return (
    <DialogPrimitives.Root open={open} onOpenChange={onChange}>
      <DialogPrimitives.Portal forceMount={true}>
        {transitions(
          (styles, item) =>
            item && (
              <>
                <DialogPrimitives.Overlay forceMount={true} asChild={true}>
                  <animated.div
                    style={{
                      position: 'fixed',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      height: '100%',
                      background: 'rgba(54, 54, 54 ,0.8)',
                      opacity: styles.opacity
                    }}
                    data-wails-drag
                  />
                </DialogPrimitives.Overlay>
                <DialogPrimitives.Content forceMount={true} asChild={true}>
                  <animated.div
                    style={{
                      background: 'black',
                      width: size === 'lg' ? '80%' : 375,
                      position: 'fixed',
                      top: 30,
                      left: size === 'lg' ? '10%' : 'calc(50% - 170px)',
                      boxShadow: '3px 3px 5px rgb(0,0,0,0.3)',
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 60px)',
                      translateY: styles.y,
                      opacity: styles.opacity
                    }}
                  >
                    {title && (
                      <Title
                        style={{
                          margin: 0,
                          padding: 20,
                          textTransform: 'none',
                          color: Colors.WHITE,
                          letterSpacing: 0,
                          fontSize: 28
                        }}
                      >
                        {title}
                      </Title>
                    )}
                    {children}
                  </animated.div>
                </DialogPrimitives.Content>
              </>
            )
        )}
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  )
}
