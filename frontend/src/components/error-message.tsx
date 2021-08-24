import React from 'react'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({
  message
}: ErrorMessageProps): JSX.Element | null => {
  return <p style={{ color: 'red' }}>{message}</p>
}
