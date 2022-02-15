import React from 'react'

import { Colors } from '../../config/colors'

export const SplashLoader = ({ text = 'Loading' }: { text?: string }) => {
  const [, forceRender] = React.useState(false)
  React.useEffect(() => {
    const interval = setInterval(() => {
      forceRender(x => !x)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      data-testid='splash-loader'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          width: 50,
          height: 50,
          marginBottom: 20
        }}
      >
        {new Array(25).fill(null).map((_, i) => {
          return (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                background: Colors.WHITE,
                opacity: Math.random() > 0.75 ? 1 : 0
              }}
            />
          )
        })}
      </div>
      <div style={{ color: Colors.WHITE, fontSize: 20 }}>{text}</div>
    </div>
  )
}
