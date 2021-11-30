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
import { ButtonUnstyled } from '../button-unstyled'

export function Chrome({ children }: { children: React.ReactNode }) {
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
        <Link to='/'>
          <Vega style={{ width: 30, height: 30 }} />
        </Link>
        <NetworkSwitcher />
      </div>
      <KeypairControls />
      <main style={{ marginTop: 35 }}>{children}</main>
    </div>
  )
}

function KeypairControls() {
  const { goBack } = useHistory()
  const { state, dispatch } = useGlobal()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        gap: 10,
        borderBottom: `1px solid ${Colors.DARK_GRAY_5}`,
        minHeight: 45
      }}>
      <div>
        <ButtonUnstyled onClick={() => goBack()}>
          <ChevronLeft
            style={{ width: 15, height: 15, position: 'relative', top: 2 }}
          />
        </ButtonUnstyled>
      </div>
      {state.wallet?.keypair ? (
        <div>
          <CopyWithTooltip text={state.wallet.keypair.PublicKey}>
            <ButtonUnstyled>
              {state.wallet.keypair.Name}{' '}
              <span className='text-muted'>
                {state.wallet.keypair.PublicKeyShort}{' '}
                <Copy style={{ width: 10, height: 10 }} />
              </span>
            </ButtonUnstyled>
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
