import React from 'react'
import { Tooltip2 } from '@blueprintjs/popover2'
import { Position } from '@blueprintjs/core'

interface TooltipProps {
  children: React.ReactElement
  content: string
  isOpen?: boolean
}

export function Tooltip({ children, content, isOpen }: TooltipProps) {
  return (
    <Tooltip2 content={content} position={Position.BOTTOM} isOpen={isOpen}>
      {children}
    </Tooltip2>
  )
}
