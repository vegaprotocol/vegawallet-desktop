import React from 'react'
import ReactDOM from 'react-dom'
import { Intent } from '../../config/intent'
import { Toast } from './toast'

export interface ToastOptions {
  id: string
  message: React.ReactNode
  intent: Intent
}

interface ToasterState {
  toasts: ToastOptions[]
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
    document.body.appendChild(container)
    // @ts-ignore
    const toaster = ReactDOM.render(<Toaster />, container) as Toaster
    return toaster
  }

  handleDismiss = (toast: ToastOptions) => {
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(t => {
        return t.id !== toast.id
      })
    }))
  }

  show(toast: Pick<ToastOptions, 'message' | 'intent'>) {
    this.setState(curr => {
      return {
        ...curr,
        toasts: [
          {
            // @ts-ignore
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
      <>
        {this.state.toasts.map((t, i) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            intent={t.intent}
            onDismiss={this.handleDismiss}
          />
        ))}
      </>
    )
  }
}

export const AppToaster = Toaster.create()
