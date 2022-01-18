import React from 'react'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Cross } from '../icons/cross'

export function DrawerCloseButton() {
  const { dispatch } = useGlobal()

  return (
    <ButtonUnstyled
      onClick={() => dispatch(setDrawerAction(false))}
      style={{ position: 'relative' }}>
      <Cross style={{ width: 40, height: 40 }} />
    </ButtonUnstyled>
  )
}
