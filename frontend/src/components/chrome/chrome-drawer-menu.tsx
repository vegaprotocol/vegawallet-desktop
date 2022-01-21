import './chrome-drawer-menu.css'
import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import { Link } from 'react-router-dom'
import { Links } from '../../config/links'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../../routes/router-config'
import { DrawerCloseButton } from '../chrome/drawer-close-button'
import { ExternalLink } from '../external-link'
import { NetworkPaths } from '../../routes/network'
import { ArrowTopRight } from '../icons/arrow-top-right'

export function ChromeDrawerMenu() {
  const { state, dispatch } = useGlobal()
  const close = React.useCallback(() => {
    dispatch(setDrawerAction(false))
  }, [dispatch])

  return (
    <Dialog.Root open={state.drawerOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            background: 'rgba(54, 54, 54 ,0.8)'
          }}
        />
        <Dialog.Content
          onPointerDownOutside={close}
          className='chrome-drawer-menu__content'
          style={{
            background: 'black',
            width: '50vw',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0
          }}>
          {/* <Menu /> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
