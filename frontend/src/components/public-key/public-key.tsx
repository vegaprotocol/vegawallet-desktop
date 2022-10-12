import { Colors } from '../../config/colors'
import type { KeyPair } from '../../contexts/global/global-context'
import { BreakText } from '../break-text'
import { CopyWithTooltip } from '../copy-with-tooltip'

type PublicKeyProps = {
  keypair: KeyPair
}

export const PublicKey = ({ keypair }: PublicKeyProps) => {
  return (
    <div style={{ padding: '20px 20px 0' }}>
      <div>Public key:</div>
      <div style={{ color: Colors.GRAY_1 }}>
        <CopyWithTooltip text={keypair.publicKey ?? ''}>
          <BreakText>{keypair.publicKey}</BreakText>
        </CopyWithTooltip>
      </div>
    </div>
  )
}
