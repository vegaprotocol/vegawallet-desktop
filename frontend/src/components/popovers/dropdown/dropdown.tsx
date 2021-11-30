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
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', minWidth: 200 }}>
      {children}
    </ul>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
}

export function DropdownMenuItem({ children }: DropdownMenuItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 0'
      }}>
      {children}
    </li>
  )
}
