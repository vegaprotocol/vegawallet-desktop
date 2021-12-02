import React from 'react'
import { Colors } from '../../config/colors'

interface BulletHeaderProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
}

export const BulletHeader = ({ tag, children }: BulletHeaderProps) => {
  return React.createElement(
    tag,
    {
      className: 'bullet-header',
      style: {
        fontSize: 22,
        fontWeight: 300,
        margin: '35px 0 0',
        padding: '0 0 25px',
        fontFamily: 'AlphaLyrae',
        textTransform: 'uppercase'
      }
    },
    <div>
      <span
        style={{
          display: 'inline-block',
          width: 16,
          height: 16,
          marginRight: 10,
          backgroundColor: Colors.WHITE
        }}
      />
      {children}
    </div>
  )
}
