import React from 'react'
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import { Colors } from '../../config/colors'

interface DropdownMenuProps {
  trigger: React.ReactNode
  content: React.ReactNode
  style?: React.CSSProperties
}

export function DropdownMenu({ trigger, content }: DropdownMenuProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild={true}>
        {trigger}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Content
        align='center'
        style={{ background: Colors.DARK_GRAY_3, padding: 10 }}
      >
        {content}
        <DropdownPrimitive.Arrow fill={Colors.DARK_GRAY_3} />
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Root>
  )
}

export function DropdownItem({
  children,
  ...props
}: DropdownPrimitive.MenuItemProps) {
  return <DropdownPrimitive.Item {...props}>{children}</DropdownPrimitive.Item>
}
