import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

interface DropdownProps {
  content: React.ReactElement
  trigger: React.ReactElement
}

export function Popover({ content, trigger }: DropdownProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild={true}>
        {trigger}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content className='zzzzzzzz'>
        {content}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
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
        // background: `url(${bg})`,
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
