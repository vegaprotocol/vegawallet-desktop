import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { ComponentProps } from 'react'
import type { Control, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Colors } from '../../config/colors'

type RadioGroupProps<T> = {
  name: Path<T>
  options: Array<{ value: string; label: string }>
  // TODO: Figure out how best to type the control prop, it should be form generic
  control: Control<T>
  rules?: ComponentProps<typeof Controller>['rules']
  orientation?: 'vertical' | 'horizontal'
  itemStyle?: React.CSSProperties
}

export function RadioGroup<T>({
  name,
  control,
  rules,
  options,
  itemStyle,
  orientation = 'vertical'
}: RadioGroupProps<T>) {
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
      rules={rules}
      control={control}
      render={({ field }) => {
        return (
          <RadioGroupPrimitive.Root
            value={typeof field.value === 'string' ? field.value : undefined}
            onValueChange={field.onChange}
            name={field.name}
            orientation={orientation}
            style={rootStyle}
          >
            {options.map(o => (
              <div key={o.value} style={{ ...wrapper, ...itemStyle }}>
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
