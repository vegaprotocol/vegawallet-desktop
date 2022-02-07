import React from 'react'

export function useWindowSize() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = React.useState(window.innerHeight)

  React.useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    width: windowWidth,
    height: windowHeight
  }
}
