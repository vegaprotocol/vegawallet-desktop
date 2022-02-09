import React from 'react'

import type { CreateWalletResponse } from '../../models/wallet'
import { ButtonUnstyled } from '../button-unstyled'
import { Callout } from '../callout'
import { CodeBlock } from '../code-block'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Copy } from '../icons/copy'
import { Warning } from '../icons/warning'

interface WalletCreateFormSuccessProps {
  response: CreateWalletResponse
  callToAction?: React.ReactNode
}

export function WalletCreateFormSuccess({
  response,
  callToAction
}: WalletCreateFormSuccessProps) {
  return (
    <>
      <Callout
        title='Warning'
        className='vega-bg'
        style={{ background: 'image-set()', backgroundSize: 'cover' }}
        icon={<Warning style={{ width: 15, height: 15 }} />}
      >
        <p data-testid='wallet-warning'>
          Save your recovery phrase now, you will need it to recover your
          wallet. Keep it secure and secret. Your recovery phrase is only shown
          once and cannot be recovered.
        </p>
      </Callout>
      <p data-testid='wallet-version'>Wallet version</p>
      <p>
        <CodeBlock>{response.wallet.version}</CodeBlock>
      </p>
      <p>Recovery phrase</p>
      <p style={{ position: 'relative' }} data-testid='wallet-recovery-phrase'>
        <CodeBlock>{response.wallet.recoveryPhrase}</CodeBlock>
        <span style={{ position: 'absolute', top: 7, right: 10 }}>
          <CopyWithTooltip text={response.wallet.recoveryPhrase}>
            <ButtonUnstyled>
              <Copy style={{ width: 13, height: 13 }} />
            </ButtonUnstyled>
          </CopyWithTooltip>
        </span>
      </p>
      {callToAction}
    </>
  )
}
