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
          <Menu />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Menu() {
  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 0 0 15px',
          minHeight: 45
        }}>
        <h1
          style={{
            fontSize: 18,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0
          }}>
          Vega
        </h1>
        <DrawerCloseButton />
      </header>
      <nav
        style={{
          padding: 15,
          borderBottom: `3px solid`,
          borderImage: `url(${process.env.PUBLIC_URL}/vega-bg.png) 15%`
        }}>
        <AppLink to={Paths.Wallet}>Wallets</AppLink>
        <AppLink to={Paths.Import}>Add / Recover Wallet</AppLink>
        <AppLink to={Paths.Service}>Wallet Service</AppLink>
        <AppLink to={Paths.Network}>Network Configuration</AppLink>
        <AppLink to={NetworkPaths.Import}>Add Network</AppLink>
      </nav>
      <nav style={{ padding: 15 }}>
        <NavExternalLink href={Links.DOCS}>Docs</NavExternalLink>
        <NavExternalLink href={Links.GITHUB}>Github</NavExternalLink>
      </nav>
    </div>
  )
}

interface NavLinkProps {
  children: React.ReactNode
  to: string
}

function AppLink({ children, to }: NavLinkProps) {
  const { dispatch } = useGlobal()
  return (
    <div>
      <Link
        to={to}
        style={{ display: 'block', padding: '10px 0', textDecoration: 'none' }}
        onClick={() => dispatch(setDrawerAction(false))}>
        {children}
      </Link>
    </div>
  )
}

interface ExternalLinkProps {
  children: React.ReactNode
  href: string
}

function NavExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <div>
      <ExternalLink
        href={href}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          textDecoration: 'none'
        }}>
        {children}
        <ArrowTopRight style={{ width: 13, height: 13 }} />
      </ExternalLink>
    </div>
  )
}
