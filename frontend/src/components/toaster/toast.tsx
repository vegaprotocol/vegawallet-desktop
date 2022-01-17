import './toast.scss'
import React from 'react'
import { Intent } from '../../config/intent'

export interface ToastProps {
  intent?: Intent
  message: React.ReactNode
  onDismiss?: (didTimeoutExpire: boolean) => void
  timeout?: number
}

export class Toast extends React.Component<ToastProps> {
  public static defaultProps: ToastProps = {
    message: '',
    timeout: 5000
  }

  public render(): JSX.Element {
    const { message } = this.props
    return (
      <div
        // onBlur={this.startTimeout}
        // onFocus={this.clearTimeouts}
        // onMouseEnter={this.clearTimeouts}
        // onMouseLeave={this.startTimeout}
        tabIndex={0}
        role='alert'>
        <span>{message}</span>
      </div>
    )
  }

  // public componentDidMount() {
  //     this.startTimeout();
  // }

  // public componentDidUpdate(prevProps: IToastProps) {
  //     if (prevProps.timeout !== this.props.timeout) {
  //         if (this.props.timeout! > 0) {
  //             this.startTimeout();
  //         } else {
  //             this.clearTimeouts();
  //         }
  //     }
  // }

  // public componentWillUnmount() {
  //     this.clearTimeouts();
  // }

  // private handleCloseClick = () => this.triggerDismiss(false);

  // private triggerDismiss(didTimeoutExpire: boolean) {
  //     // this.clearTimeouts();
  //     this.props.onDismiss?.(didTimeoutExpire);
  // }

  // private startTimeout = () => {
  //     this.clearTimeouts();
  //     if (this.props.timeout! > 0) {
  //         this.setTimeout(() => this.triggerDismiss(true), this.props.timeout);
  //     }
  // };
}

// export const Toast = ({
//   id,
//   message,
//   onDismiss,
//   color = 'purple'
// }: {
//   id: string
//   message: string
//   onDismiss: (key: string) => void
//   color?: string
// }) => {
//   React.useEffect(() => {
//     const timeout = setTimeout(() => {
//       onDismiss(id)
//     }, 3000)

//     return () => clearTimeout(timeout)
//   }, [id, onDismiss])

//   return (
//     <div
//       role='alert'
//       style={{
//         padding: '10px 20px',
//         background: color,
//         color: 'black',
//         minWidth: 200,
//         marginTop: 20,
//         borderRadius: 2,
//         animation: 'drop 0.3s ease',
//         animationFillMode: 'forwards',
//         transform: 'translateY(-100%)'
//       }}
//     >
//       {message}
//     </div>
//   )
// }
