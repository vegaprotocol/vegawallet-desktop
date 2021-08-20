import './toaster.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import { Toast } from './toast'

interface ToasterState {
  toasts: Array<{ id: string; message: string; color?: string }>
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
    document.body.appendChild(container)
    // @ts-ignore
    const toaster = ReactDOM.render(<Toaster />, container) as Toaster
    return toaster
  }

  handleDismiss = (id: string) => {
    this.setState(({ toasts }) => ({
      toasts: toasts.filter(t => {
        return t.id !== id
      })
    }))
  }

  show(toast: { message: string; color?: string }) {
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
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            color={t.color}
            onDismiss={this.handleDismiss}
          />
        ))}
      </>
    )
  }
}

export const AppToaster = Toaster.create()
