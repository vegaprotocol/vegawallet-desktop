import React from 'react'
import { NetworkSwitcher } from './network-switcher'
import { Link } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { Colors } from '../../config/colors'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Copy } from '../icons/copy'
import { ButtonUnstyled } from '../button-unstyled'
import { Drawer, Position } from '@blueprintjs/core'
import { Links } from '../../config/links'
import { Vega } from '../icons'

export function Chrome({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useGlobal()
  return (
    <div style={{ height: '100%', background: '#101010' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 45,
          borderBottom: `1px solid ${Colors.DARK_GRAY_5}`,
          background: '#040404'
        }}>
        <ButtonUnstyled
          style={{ padding: '10px 15px', fontFamily: 'AlphaLyrae' }}
          onClick={() =>
            dispatch({ type: 'SET_DRAWER', open: !state.drawerOpen })
          }>
          Menu
        </ButtonUnstyled>
        <KeypairControls />
        <NetworkSwitcher />
      </div>
      <main style={{ padding: '0 15px', marginTop: 35 }}>{children}</main>
      <Drawer
        isOpen={state.drawerOpen}
        position={Position.LEFT}
        onClose={() => dispatch({ type: 'SET_DRAWER', open: false })}>
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

function KeypairControls() {
  const { state } = useGlobal()

  return (
    <div>
      {state.wallet?.keypair ? (
        <div>
          <CopyWithTooltip text={state.wallet.keypair.publicKey}>
            <ButtonUnstyled>
              {state.wallet.keypair.name}{' '}
              <span className='text-muted'>
                {state.wallet.keypair.publicKeyShort}{' '}
                <Copy style={{ width: 10, height: 10 }} />
              </span>
            </ButtonUnstyled>
          </CopyWithTooltip>
        </div>
      ) : null}
      {/* {state.wallet?.keypairs?.length ? (
        <div style={{ marginLeft: 'auto' }}>
          <KeypairSwitcher
            wallet={state.wallet}
            onSelect={kp => dispatch({ type: 'CHANGE_KEYPAIR', keypair: kp })}
          />
        </div>
      ) : null} */}
    </div>
  )
}

function Menu() {
  return (
    <div style={{ fontFamily: 'AlphaLyrae', padding: 15 }}>
      <nav
        style={{
          borderBottom: `1px solid ${Colors.DARK_GRAY_5}`,
          paddingBottom: 15
        }}>
        <AppLink to='/'>Wallets</AppLink>
        <AppLink to='/import'>Add / Import Wallet</AppLink>
      </nav>
      <nav style={{ marginTop: 15 }}>
        <ExternalLink href={Links.DOCS}>Docs</ExternalLink>
        <ExternalLink href={Links.GITHUB}>Github</ExternalLink>
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
        onClick={() => dispatch({ type: 'SET_DRAWER', open: false })}>
        {children}
      </Link>
    </div>
  )
}

interface ExternalLinkProps {
  children: React.ReactNode
  href: string
}

function ExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <div>
      <a href={href} style={{ display: 'block', padding: '10px 0' }}>
        {children}
      </a>
    </div>
  )
}
