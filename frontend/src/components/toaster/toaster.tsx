import React from 'react'
import ReactDOM from 'react-dom'
import { animated, config, useTransition } from 'react-spring'

import type { Intent } from '../../config/intent'
import { Toast as ToastComponent } from './toast'

// Toast object to be stored in state
export interface Toast {
  id: string
  message: React.ReactNode
  intent?: Intent
  timeout?: number
}

// Options object to be passed to AppToaster.show(toastOptions)
export interface ToastOptions {
  message: React.ReactNode
  intent?: Intent
  timeout?: number
}

interface ToasterState {
  toasts: Toast[]
}

export class Toaster extends React.Component<any, ToasterState> {
  toastId = 0
  container: HTMLDivElement | null = null

  state: ToasterState = {
    toasts: []
  }

  public static create() {
    const container = document.createElement('div')
    container.className = 'toaster-container'
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.flexFlow = 'column nowrap'
    container.style.top = '0'
    container.style.right = '0'
    container.style.left = '0'
    container.style.position = 'absolute'
    container.style.pointerEvents = 'none'
    container.style.padding = '30px 20px 20px'
    container.style.zIndex = '10'
    document.body.appendChild(container)
    // @ts-ignore
    const toaster = ReactDOM.render(<Toaster />, container) as Toaster
    return toaster
  }

  handleDismiss = (toast: Toast) => {
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(t => {
        return t.id !== toast.id
      })
    }))
  }

  show(toast: ToastOptions) {
    this.setState(curr => {
      return {
        ...curr,
        toasts: [
          {
            id: `toast-${this.toastId++}`,
            ...toast
          },
          ...curr.toasts
        ]
      }
    })
  }

  componentDidMount() {
    this.container = document.createElement('div')
    this.container.className = 'toaster-portal-container'
  }

  render() {
    if (this.container === null) {
      return null
    }

    return (
      <ToasterAnimationHandler
        toasts={this.state.toasts}
        handleDismiss={this.handleDismiss}
      />
    )
  }
}

export const AppToaster = Toaster.create()

interface ToasterAnimationHandlerProps {
  toasts: Toast[]
  handleDismiss: (toast: Toast) => void
}

function ToasterAnimationHandler({
  toasts,
  handleDismiss
}: ToasterAnimationHandlerProps) {
  const height = 49
  const transitions = useTransition(toasts, {
    from: () => ({ y: -height, opacity: 0 }),
    enter: (t, i) => ({ opacity: 1, y: i * height }),
    update: (t, i) => ({ opacity: 1, y: i * height }),
    leave: (t, i) => ({ y: (i - 1) * height, opacity: 0 }),
    config: { ...config.default, duration: 170 }
  })

  return transitions((styles, t) => {
    return (
      <animated.div
        key={t.id}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          paddingTop: 15,
          ...styles
        }}
      >
        <ToastComponent key={t.id} onDismiss={handleDismiss} {...t} />
      </animated.div>
    )
  })
}
