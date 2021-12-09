import React from 'react'
import { Popover2 } from '@blueprintjs/popover2'
import { Position } from '@blueprintjs/core'
// @ts-ignore
import bg from '../../../images/vega-bg.png'

interface DropdownProps {
  content: React.ReactElement
  children: React.ReactElement
}

export function Dropdown({ content, children }: DropdownProps) {
  return (
    <Popover2
      transitionDuration={0}
      // @ts-ignore
      modifiers={{ arrow: { enabled: false } }}
      targetTagName='div'
      position={Position.BOTTOM_RIGHT}
      content={content}>
      {children}
    </Popover2>
  )
}

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return (
    <ul
      style={{
        margin: '2px 0 0',
        padding: 0,
        listStyle: 'none',
        minWidth: 130,
        background: `url(${bg})`,
        backgroundSize: 'cover'
      }}>
      {children}
    </ul>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  active?: boolean
}

export function DropdownMenuItem({ children }: DropdownMenuItemProps) {
  return <li>{children}</li>
}
