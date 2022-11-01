import type { Wallet } from '../../contexts/global/global-context'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'

type DisconnectDialogProps = {
  wallet: Wallet
  hostname: string
  onClose: () => void
}

export const Disconnect = ({
  wallet,
  hostname,
  onClose
}: DisconnectDialogProps) => {
  // TODO: add service.WalletClient.DisconnectWallet({...}) when made available
  const handleDisconnect = () => {}

  return (
    <div>
      <div style={{ padding: 20 }}>
        <p>
          Are you sure you want to disconnect your wallet{' '}
          <code>{wallet.name}</code> from <code>{hostname}</code>? You may lose
          site functionality.
        </p>
      </div>
      <ButtonGroup inline style={{ padding: 20 }}>
        <Button onClick={handleDisconnect}>Disconnect</Button>
        <ButtonUnstyled onClick={onClose}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </div>
  )
}
