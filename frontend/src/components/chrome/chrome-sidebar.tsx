import React from 'react'
import { NavLink } from 'react-router-dom'
import { Colors } from '../../config/colors'
import { Links } from '../../config/links'
import { Paths } from '../../routes/router-config'
import { ExternalLink } from '../external-link'
import { Vega } from '../icons'
import { ArrowTopRight } from '../icons/arrow-top-right'

export function ChromeSidebar() {
  return (
    <aside>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          minHeight: 45
        }}>
        <Vega />
      </header>
      <Menu />
    </aside>
  )
}

function Menu() {
  return (
    <>
      <nav
        style={{
          padding: 20,
          borderBottom: `3px solid`,
          borderImage: `url(${process.env.PUBLIC_URL}/vega-bg.png) 15%`
        }}>
        <AppLink to={Paths.Wallet}>Wallets</AppLink>
        <AppLink to={Paths.WalletImport}>Add / Recover Wallet</AppLink>
        <AppLink to={Paths.Service}>Wallet Service</AppLink>
        <AppLink to={Paths.Network}>Network Configuration</AppLink>
        <AppLink to={Paths.NetworkImport}>Add Network</AppLink>
      </nav>
      <nav style={{ padding: 20 }}>
        <NavExternalLink href={Links.DOCS}>Docs</NavExternalLink>
        <NavExternalLink href={Links.GITHUB}>Github</NavExternalLink>
      </nav>
    </>
  )
}

interface NavLinkProps {
  children: React.ReactNode
  to: string
}

function AppLink({ children, to }: NavLinkProps) {
  return (
    <div>
      <NavLink
        to={to}
        style={isActive => ({
          display: 'block',
          padding: '10px 0',
          textDecoration: 'none',
          color: isActive ? Colors.VEGA_YELLOW : Colors.TEXT_COLOR
        })}>
        {children}
      </NavLink>
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
