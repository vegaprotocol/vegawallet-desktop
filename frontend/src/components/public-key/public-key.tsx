import { Colors } from '../../config/colors'
import type { KeyPair } from '../../contexts/global/global-context'
import { BreakText } from '../break-text'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Title } from '../title'

type PublicKeyProps = {
  keypair: KeyPair
}

export const PublicKey = ({ keypair }: PublicKeyProps) => {
  return (
    <div style={{ padding: '0 20px' }}>
      <Title style={{ margin: '0 0 6px' }}>Public key</Title>
      <div style={{ color: Colors.WHITE }}>
        <CopyWithTooltip text={keypair.publicKey ?? ''}>
          <BreakText data-testid='public-key'>{keypair.publicKey}</BreakText>
        </CopyWithTooltip>
      </div>
    </div>
  )
}
