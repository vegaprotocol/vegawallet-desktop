import React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Controller } from 'react-hook-form'

interface CheckboxProps {
  name: string
  control: any
  label: string
}

export function Checkbox({ name, control, label }: CheckboxProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div style={wrapper}>
            <CheckboxPrimitive.Root
              checked={field.value}
              onCheckedChange={field.onChange}
              name={name}
              id={name}
              style={box}>
              <CheckboxPrimitive.Indicator style={boxInner} />
            </CheckboxPrimitive.Root>
            <label htmlFor={name}>{label}</label>
          </div>
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

const box = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
  background: 'var(--white)'
}

const boxInner = {
  width: 10,
  height: 10,
  background: 'var(--black)'
}
