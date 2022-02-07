import React from 'react'

export function usePrevious(value: any) {
  const ref = React.useRef()

  React.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
