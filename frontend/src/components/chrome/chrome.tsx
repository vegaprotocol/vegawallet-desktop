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

export function Chrome({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useGlobal()
  return (
    <div style={{ margin: '0 auto', maxWidth: 600, padding: '0 15px 15px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 45,
          borderBottom: `1px solid ${Colors.DARK_GRAY_5}`
        }}>
        <ButtonUnstyled
          onClick={() =>
            dispatch({ type: 'SET_DRAWER', open: !state.drawerOpen })
          }>
          Menu
        </ButtonUnstyled>
        <KeypairControls />
        <NetworkSwitcher />
      </div>
      <main style={{ marginTop: 35 }}>{children}</main>
      <Drawer
        isOpen={state.drawerOpen}
        position={Position.LEFT}
        onClose={() => dispatch({ type: 'SET_DRAWER', open: false })}>
        <div
          style={{
            background: Colors.DARK_GRAY_2,
            padding: 15,
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
    <nav>
      <AppLink to='/'>Wallets</AppLink>
      <AppLink to='/import'>Add / Import Wallet</AppLink>
      <ExternalLink href={Links.DOCS}>Docs</ExternalLink>
      <ExternalLink href={Links.GITHUB}>Github</ExternalLink>
    </nav>
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
        style={{ display: 'block', padding: 10 }}
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
      <a href={href} style={{ display: 'block', padding: 10 }}>
        {children}
      </a>
    </div>
  )
}
