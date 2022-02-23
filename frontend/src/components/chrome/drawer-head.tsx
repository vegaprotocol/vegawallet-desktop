import React from 'react'

import { Colors } from '../../config/colors'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownArrow } from '../icons/dropdown-arrow'

interface DrawerHeadProps {
  height: number
  children?: React.ReactNode
}

/** The part of the drawer that remains exposed */
export function DrawerHead({ height, children }: DrawerHeadProps) {
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
      <div>
        <DrawerToggle />
      </div>
    </div>
  )
}

function DrawerToggle() {
  const {
    state: { drawerOpen },
    dispatch: globalDispatch
  } = useGlobal()
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
      onClick={() => globalDispatch(setDrawerAction(!drawerOpen))}
    >
      <DropdownArrow
        style={{
          width: 16,
          height: 16,
          transform: drawerOpen ? '' : 'rotate(180deg)'
        }}
      />
    </ButtonUnstyled>
  )
}
