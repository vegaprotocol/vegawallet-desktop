import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface TooltipProps {
  trigger: React.ReactElement
  content: React.ReactNode
  isOpen?: boolean
}

export function Tooltip({ trigger, content, isOpen }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={isOpen}>
        {trigger}
        <TooltipPrimitive.Content>{content}</TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
