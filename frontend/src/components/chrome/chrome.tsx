import React from 'react'
import { NetworkSwitcher } from './network-switcher'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { Drawer, Position } from '@blueprintjs/core'
import { Links } from '../../config/links'
import { ExternalLink } from '../external-link'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { Paths } from '../../routes/router-config'
import { DrawerCloseButton } from './drawer-close-button'
import { ChromeFooter } from './chrome-footer'

const layoutStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content'
}

export function Chrome({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useGlobal()
  return (
    <div
      style={{
        ...layoutStyles,
        height: '100%',
        background: '#101010',
        overflowY: 'auto'
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 45,
          borderBottom: `3px solid`,
          borderImage: 'url(./vega-bg.png) 15% / 1 / 0',
          background: '#040404'
        }}>
        <ButtonUnstyled
          style={{
            padding: '10px 15px',
            fontFamily: 'AlphaLyrae',
            textTransform: 'uppercase',
            letterSpacing: '0.3em'
          }}
          onClick={() => dispatch(setDrawerAction(!state.drawerOpen))}>
          Menu
        </ButtonUnstyled>
        <NetworkSwitcher />
      </div>
      <main style={{ padding: 15 }}>{children}</main>
      <ChromeFooter />
      <Drawer
        isOpen={state.drawerOpen}
        position={Position.LEFT}
        onClose={() => dispatch(setDrawerAction(false))}>
        <div
          style={{
            background: '#101010',
            height: '100vh'
          }}>
          <Menu />
        </div>
      </Drawer>
    </div>
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
            fontFamily: 'AlphaLyrae',
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
          borderImage: 'url(./vega-bg.png) 15% / 1 / 0'
        }}>
        <AppLink to={Paths.Home}>Wallets</AppLink>
        <AppLink to={Paths.Import}>Add / Import Wallet</AppLink>
        <AppLink to={Paths.Service}>Wallet Service</AppLink>
        <AppLink to={Paths.Network}>Network Config</AppLink>
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
        style={{ display: 'block', padding: '10px 0' }}
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
      <ExternalLink href={href} style={{ display: 'block', padding: '10px 0' }}>
        {children}
      </ExternalLink>
    </div>
  )
}
