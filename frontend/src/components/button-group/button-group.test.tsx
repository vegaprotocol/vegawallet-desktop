import { render, screen } from '@testing-library/react'
import React from 'react'

import { ButtonGroup } from '.'

test('renders children', () => {
  const buttonText = 'Foo'
  render(
    <ButtonGroup>
      <button type='submit'>{buttonText}</button>
    </ButtonGroup>
  )

  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()
  expect(button).toHaveTextContent(buttonText)
})
