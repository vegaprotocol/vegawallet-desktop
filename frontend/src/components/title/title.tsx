import type { HTMLAttributes } from 'react'
import React from 'react'

import { Colors } from '../../config/colors'

type Variant = 'main' | 'secondary'

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  variant?: Variant
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const secondaryTitleStyles = {
  fontSize: 15,
  color: Colors.TEXT_COLOR_DEEMPHASISE,
  margin: '30px 0 20px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.3em',
  lineHeight: 1.2
} as React.CSSProperties

const mainTitleStyles = {
  fontSize: 28,
  margin: 0,
  padding: 20,
  color: Colors.WHITE,
  lineHeight: 1.2
}

const getVariantStyles = (variant: Variant): React.CSSProperties => {
  switch (variant) {
    case 'main': {
      return mainTitleStyles
    }
    case 'secondary': {
      return secondaryTitleStyles
    }
    default: {
      return {}
    }
  }
}

export const Title = ({
  children,
  style,
  variant = 'secondary',
  ...rest
}: HeaderProps) => {
  return (
    <h1
      {...rest}
      style={{
        ...getVariantStyles(variant),
        ...style
      }}
    >
      {children}
    </h1>
  )
}
