import { Colors } from '../../config/colors'
import { BreakText } from '../break-text'
import { CopyWithTooltip } from '../copy-with-tooltip'
import { Title } from '../title'

type PublicKeyProps = {
  publicKey?: string
}

export const PublicKey = ({ publicKey }: PublicKeyProps) => {
  return (
    <div style={{ padding: '0 20px' }}>
      <Title style={{ margin: '0 0 6px' }}>Public key</Title>
      <div style={{ color: Colors.WHITE }}>
        <CopyWithTooltip text={publicKey ?? ''}>
          <BreakText data-testid='public-key'>{publicKey}</BreakText>
        </CopyWithTooltip>
      </div>
    </div>
  )
}
