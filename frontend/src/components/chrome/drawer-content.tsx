import { useEffect, useState } from 'react'

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
  const { actions, dispatch } = useGlobal()

  // The current view of the drawer
  const [view, setView] = useState<DrawerViews>('network')

  // The network you are currently editing when in the edit view
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  // Close modal on escape key
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        dispatch(actions.setDrawerAction(false))
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
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
              data-testid='back'
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
              data-testid='back'
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
