import { useCallback, useEffect, useState } from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { DRAWER_HEIGHT } from '.'
import { DrawerAddPreset } from './drawer-add-preset'
import { DrawerEditNetwork } from './drawer-edit-network'
import { DrawerHead } from './drawer-head'
import { DrawerManageNetwork } from './drawer-manage-network'
import { DrawerNetwork } from './drawer-network'
import { ServiceStatus } from './service-status'

const DEFAULT_VIEW = 'network'

export type DrawerViews = 'network' | 'manage' | 'edit' | 'add'

type DrawerContentProps = {
  defaultView?: DrawerViews
}

/**
 * Renders different drawer content based on 'view' state
 */
export function DrawerContent({
  defaultView = DEFAULT_VIEW
}: DrawerContentProps) {
  const { state, actions, dispatch } = useGlobal()

  // The current view of the drawer
  const [view, setView] = useState<DrawerViews>(defaultView)

  // The network you are currently editing when in the edit view
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  // Close modal on escape key
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        dispatch(actions.setDrawerAction(false))
        setView(DEFAULT_VIEW)
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [dispatch, actions])

  const handleToggle = useCallback(
    (isOpen: boolean) => {
      dispatch(actions.setDrawerAction(isOpen))
      if (!isOpen) {
        setView(DEFAULT_VIEW)
      }
    },
    [dispatch, actions]
  )

  switch (view) {
    case 'network': {
      return (
        <>
          <DrawerHead
            height={DRAWER_HEIGHT}
            isOpen={state.drawerOpen}
            setOpen={handleToggle}
          >
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
          <DrawerHead
            height={DRAWER_HEIGHT}
            isOpen={state.drawerOpen}
            setOpen={handleToggle}
          >
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
          <DrawerHead
            height={DRAWER_HEIGHT}
            isOpen={state.drawerOpen}
            title={selectedNetwork}
            setOpen={handleToggle}
          >
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
    case 'add': {
      return (
        <>
          <DrawerHead
            height={DRAWER_HEIGHT}
            isOpen={state.drawerOpen}
            setOpen={handleToggle}
          >
            <ButtonUnstyled
              data-testid='back'
              style={{ textDecoration: 'none' }}
              onClick={() => setView('manage')}
            >
              Back
            </ButtonUnstyled>
          </DrawerHead>
          <DrawerContentWrapper>
            <DrawerAddPreset />
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
