import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Colors } from '../../config/colors'

interface TooltipProps {
  trigger: React.ReactElement
  content: React.ReactNode
  isOpen?: boolean
}

export function Tooltip({ trigger, content, isOpen }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={isOpen}>
        <TooltipPrimitive.Trigger>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          style={{ background: Colors.DARK_GRAY_2, padding: '5px 10px' }}>
          <TooltipPrimitive.Arrow fill={Colors.DARK_GRAY_2} />
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
