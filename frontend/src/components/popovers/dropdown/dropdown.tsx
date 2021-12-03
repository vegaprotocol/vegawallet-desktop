import React from 'react'
import { Popover2 } from '@blueprintjs/popover2'
import { Position } from '@blueprintjs/core'

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
        margin: 0,
        padding: 0,
        listStyle: 'none',
        minWidth: 130
      }}>
      {children}
    </ul>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  active?: boolean
}

export function DropdownMenuItem({
  children,
  active = false
}: DropdownMenuItemProps) {
  return (
    <li
      style={{
        borderLeft: '3px solid transparent',
        borderLeftColor: active ? '#fff' : 'transparent',
        borderImage: active ? 'url(./vega-bg.png) 15% / 1 / 0' : 'none'
      }}>
      {children}
    </li>
  )
}
