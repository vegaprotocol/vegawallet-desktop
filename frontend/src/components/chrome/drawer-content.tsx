import React from 'react'
import { DRAWER_HEIGHT } from '.'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { DrawerEditNetwork } from './drawer-edit-network'
import { DrawerHead } from './drawer-head'
import { DrawerManageNetwork } from './drawer-manage-network'
import { DrawerNetwork } from './drawer-network'
import { ServiceStatus } from './service-status'

export type DrawerViews = 'network' | 'manage' | 'edit'

export function DrawerContent() {
  const { dispatch } = useGlobal()
  const [view, setView] = React.useState<DrawerViews>('network')
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

  const renderView = () => {
    switch (view) {
      case 'network': {
        return (
          <>
            <DrawerHead height={DRAWER_HEIGHT}>
              <ServiceStatus />
            </DrawerHead>
            <DrawerNetwork setView={setView} />
          </>
        )
      }
      case 'manage': {
        return (
          <>
            <DrawerHead height={DRAWER_HEIGHT}>
              <ButtonUnstyled onClick={() => setView('network')}>
                Back
              </ButtonUnstyled>
            </DrawerHead>
            <DrawerManageNetwork
              setView={setView}
              setSelectedNetwork={setSelectedNetwork}
            />
          </>
        )
      }
      case 'edit': {
        return (
          <>
            <DrawerHead height={DRAWER_HEIGHT}>
              <ButtonUnstyled onClick={() => setView('manage')}>
                Back
              </ButtonUnstyled>
            </DrawerHead>
            <DrawerEditNetwork selectedNetwork={selectedNetwork} />
          </>
        )
      }
    }
  }

  return <div>{renderView()}</div>
}
