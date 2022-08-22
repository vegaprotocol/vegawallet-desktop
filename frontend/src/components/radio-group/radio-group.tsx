import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Colors } from '../../config/colors'

interface RadioGroupProps {
  name: string
  options: Array<{ value: string; label: string }>
  // TODO: Figure out how best to type the control prop, it should be form generic
  control: Control
  orientation?: 'vertical' | 'horizontal'
}

export function RadioGroup({
  name,
  control,
  options,
  orientation = 'vertical'
}: RadioGroupProps) {
  const rootStyle =
    orientation === 'horizontal'
      ? {
          display: 'grid',
          gridTemplateColumns: Array(options.length).fill('1fr').join(' ')
        }
      : {}

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <RadioGroupPrimitive.Root
            value={field.value}
            onValueChange={field.onChange}
            name={field.name}
            orientation={orientation}
            style={rootStyle}
          >
            {options.map(o => (
              <div key={o.value} style={wrapper}>
                <RadioGroupPrimitive.Item
                  value={o.value}
                  id={o.value}
                  style={circle}
                >
                  <RadioGroupPrimitive.Indicator style={circleInner} />
                </RadioGroupPrimitive.Item>
                <label htmlFor={o.value}>{o.label}</label>
              </div>
            ))}
          </RadioGroupPrimitive.Root>
        )
      }}
    />
  )
}

const wrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: 10
}

const circle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  borderRadius: '100%',
  background: Colors.DARK_GRAY_5
}

const circleInner = {
  width: 8,
  height: 8,
  background: Colors.WHITE,
  borderRadius: '100%'
}
