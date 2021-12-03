import React from 'react'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'

export function DrawerCloseButton() {
  const { dispatch } = useGlobal()
  const crossbarStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 13,
    display: 'block',
    width: 20,
    height: 2,
    background: 'white',
    transformOrigin: 'center center'
  }
  return (
    <ButtonUnstyled
      onClick={() => dispatch(setDrawerAction(false))}
      style={{ position: 'relative', width: 45, height: 45 }}>
      <div
        style={{
          ...crossbarStyle,
          transform: 'rotate(45deg)'
        }}
      />
      <div
        style={{
          ...crossbarStyle,
          transform: 'rotate(-45deg)'
        }}
      />
    </ButtonUnstyled>
  )
}
