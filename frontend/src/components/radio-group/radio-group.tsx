import React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Controller } from 'react-hook-form'

interface RadioGroupProps {
  name: string
  control: any
  options: Array<{ value: string; label: string }>
}

export function RadioGroup({ name, control, options }: RadioGroupProps) {
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
            orientation='vertical'>
            {options.map(o => (
              <div key={o.value} style={wrapper}>
                <RadioGroupPrimitive.Item
                  value={o.value}
                  id={o.value}
                  style={circle}>
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
  background: 'var(--dark-gray2)'
}

const circleInner = {
  width: 10,
  height: 10,
  background: 'var(--white)',
  borderRadius: '100%'
}