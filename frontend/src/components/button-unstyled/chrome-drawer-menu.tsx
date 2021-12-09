import { Drawer, Position } from '@blueprintjs/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Links } from '../../config/links'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../../routes/router-config'
import { DrawerCloseButton } from '../chrome/drawer-close-button'
import { ExternalLink } from '../external-link'
// @ts-ignore
import bg from '../../images/vega-bg.png'

export function ChromeDrawerMenu() {
  const { state, dispatch } = useGlobal()
  return (
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
          borderImage: `url(${bg}) 15%`
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
