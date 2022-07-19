import * as DialogPrimitives from '@radix-ui/react-dialog'
import * as React from 'react'
import { animated, config, useTransition } from 'react-spring'

interface DialogProps {
  open: boolean
  children: React.ReactElement
}

export function Dialog({ open, children }: DialogProps) {
  const transitions = useTransition(open, {
    from: { opacity: 0, y: -10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -10 },
    config: { ...config.default, duration: 170 }
  })
  return (
    <DialogPrimitives.Root open={open}>
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
                  />
                </DialogPrimitives.Overlay>
                <DialogPrimitives.Content forceMount={true} asChild={true}>
                  <animated.div
                    style={{
                      padding: 20,
                      background: 'black',
                      width: 340,
                      position: 'fixed',
                      top: 30,
                      left: 'calc(50% - 170px)',
                      boxShadow: '3px 3px 5px rgb(0,0,0,0.3)',
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 60px)',
                      translateY: styles.y,
                      opacity: styles.opacity
                    }}
                  >
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
