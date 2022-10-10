import React from 'react'

import { Colors } from '../../config/colors'
import { ButtonUnstyled } from '../button-unstyled'
import { Title } from '../title'
import { DropdownArrow } from '../icons/dropdown-arrow'

interface DrawerHeadProps {
  title?: string | null
  height: number
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  children?: React.ReactNode
}

/** The part of the drawer that remains exposed */
export function DrawerHead({
  height,
  title,
  isOpen,
  setOpen,
  children
}: DrawerHeadProps) {
  return (
    <div
      style={{
        height,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px 10px 20px',
        borderBottom: `1px solid ${Colors.DARK_GRAY_3}`,
        fontSize: 14
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {children}
      </div>
      {title && <Title style={{ margin: 0 }}>{title}</Title>}
      <div>
        <DrawerToggle isOpen={isOpen} setOpen={setOpen} />
      </div>
    </div>
  )
}

type DrawerToggleProps = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

function DrawerToggle({ isOpen, setOpen }: DrawerToggleProps) {
  const [hover, setHover] = React.useState(false)

  return (
    <ButtonUnstyled
      data-testid='network-drawer'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        borderRadius: '50%',
        background: hover ? Colors.DARK_GRAY_2 : 'transparent'
      }}
      onClick={() => setOpen(!isOpen)}
    >
      <DropdownArrow
        style={{
          width: 16,
          height: 16,
          transform: isOpen ? '' : 'rotate(180deg)'
        }}
      />
    </ButtonUnstyled>
  )
}
