import './chrome.scss'
import React from 'react'
import { NetworkSwitcher } from './network-switcher'
import { Vega } from '../icons'
import { Link, useHistory } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { ChevronLeft } from '../icons/chevron-left'
import { Colors } from '../../config/colors'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Copy } from '../icons/copy'
import { KeypairSwitcher } from './keypair-switcher'

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className='chrome'>
      <div className='chrome__topbar'>
        <Link to='/'>
          <Vega style={{ width: 30, height: 30 }} />
        </Link>
        <NetworkSwitcher />
      </div>
      <KeypairControls />
      <main className='chrome__main'>{children}</main>
    </div>
  )
}

function KeypairControls() {
  const { goBack } = useHistory()
  const { state, dispatch } = useGlobal()
  const buttonStyle: React.CSSProperties = {
    appearance: 'none',
    border: 0,
    background: 'transparent',
    padding: '0 10px'
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${Colors.DARK_GRAY_5}`,
        minHeight: 45
      }}>
      <div>
        <button onClick={() => goBack()} style={buttonStyle}>
          <ChevronLeft style={{ width: 15, height: 15 }} />
        </button>
      </div>
      {state.wallet?.keypair ? (
        <div>
          <CopyWithTooltip text={state.wallet.keypair.PublicKey}>
            <button style={buttonStyle}>
              {state.wallet.keypair.Name}{' '}
              <span className='text-muted'>
                {state.wallet.keypair.PublicKeyShort}{' '}
                <Copy style={{ width: 10, height: 10 }} />
              </span>
            </button>
          </CopyWithTooltip>
        </div>
      ) : null}
      {state.wallet?.keypairs?.length ? (
        <div style={{ marginLeft: 'auto' }}>
          <KeypairSwitcher
            wallet={state.wallet}
            onSelect={kp => dispatch({ type: 'CHANGE_KEYPAIR', keypair: kp })}
          />
        </div>
      ) : null}
    </div>
  )
}
