import type { ReactNode } from 'react'

import { Colors } from '../../config/colors'
import type { CreateWalletResponse } from '../../wailsjs/go/models'
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
      <SuccessSection>
        <Callout
          title='Warning'
          icon={<Warning style={{ width: 15, height: 15 }} />}
          style={{ color: Colors.BLACK, background: Colors.WHITE }}
        >
          <p data-testid='wallet-warning'>
            Save your recovery phrase now, you will need it to recover your
            wallet. Keep it secure and secret. Your recovery phrase is only
            shown once and cannot be recovered.
          </p>
        </Callout>
      </SuccessSection>
      <SuccessSection>
        <p data-testid='wallet-version'>Wallet version</p>
        <p>
          <CodeBlock>{response.wallet.version}</CodeBlock>
        </p>
      </SuccessSection>
      <SuccessSection>
        <p>Recovery phrase</p>
        <p
          style={{ position: 'relative' }}
          data-testid='wallet-recovery-phrase'
        >
          <CodeBlock>{response.wallet.recoveryPhrase}</CodeBlock>
          <span style={{ position: 'absolute', top: 7, right: 10 }}>
            <CopyWithTooltip text={response.wallet.recoveryPhrase}>
              <ButtonUnstyled>
                <Copy style={{ width: 13, height: 13 }} />
              </ButtonUnstyled>
            </CopyWithTooltip>
          </span>
        </p>
      </SuccessSection>
      {callToAction}
    </>
  )
}

function SuccessSection({ children }: { children: ReactNode }) {
  return <div style={{ marginBottom: 20 }}>{children}</div>
}
