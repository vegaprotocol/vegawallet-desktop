import React from 'react'

import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { DRAWER_HEIGHT } from '.'
import { DrawerEditNetwork } from './drawer-edit-network'
import { DrawerHead } from './drawer-head'
import { DrawerManageNetwork } from './drawer-manage-network'
import { DrawerNetwork } from './drawer-network'
import { ServiceStatus } from './service-status'

export type DrawerViews = 'network' | 'manage' | 'edit'

/**
 * Renders different drawer content based on 'view' state
 */
export function DrawerContent() {
  const { dispatch } = useGlobal()

  // The current view of the drawer
  const [view, setView] = React.useState<DrawerViews>('network')

  // The network you are currently editing when in the edit view
  const [selectedNetwork, setSelectedNetwork] = React.useState<string | null>(
    null
  )

  // Close modal on escape key
  React.useEffect(() => {
    function handleKeydown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Escape') {
        dispatch(setDrawerAction(false))
      }
    }

    window.addEventListener('keydown', handleKeydown as any)

    return () => {
      window.removeEventListener('keydown', handleKeydown as any)
    }
  }, [dispatch])

  switch (view) {
    case 'network': {
      return (
        <>
          <DrawerHead height={DRAWER_HEIGHT}>
            <ServiceStatus />
          </DrawerHead>
          <DrawerContentWrapper>
            <DrawerNetwork setView={setView} />
          </DrawerContentWrapper>
        </>
      )
    }
    case 'manage': {
      return (
        <>
          <DrawerHead height={DRAWER_HEIGHT}>
            <ButtonUnstyled
              style={{ textDecoration: 'none' }}
              onClick={() => setView('network')}
            >
              Back
            </ButtonUnstyled>
          </DrawerHead>
          <DrawerContentWrapper>
            <DrawerManageNetwork
              setView={setView}
              setSelectedNetwork={setSelectedNetwork}
            />
          </DrawerContentWrapper>
        </>
      )
    }
    case 'edit': {
      return (
        <>
          <DrawerHead height={DRAWER_HEIGHT}>
            <ButtonUnstyled
              style={{ textDecoration: 'none' }}
              onClick={() => setView('manage')}
            >
              Back
            </ButtonUnstyled>
          </DrawerHead>
          <DrawerContentWrapper>
            <DrawerEditNetwork selectedNetwork={selectedNetwork} />
          </DrawerContentWrapper>
        </>
      )
    }
    default: {
      throw new Error('Invalid drawer view')
    }
  }
}

interface DrawerContentWrapperProps {
  children: React.ReactNode
}

function DrawerContentWrapper({ children }: DrawerContentWrapperProps) {
  return <div style={{ padding: 20 }}>{children}</div>
}
