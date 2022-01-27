import React from 'react'
import ReactDOM from 'react-dom'
import { Intent } from '../../config/intent'
import { Toast } from './toast'

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
      <>
        {this.state.toasts.map((t, i) => (
          <Toast key={t.id} onDismiss={this.handleDismiss} {...t} />
        ))}
      </>
    )
  }
}

export const AppToaster = Toaster.create()
