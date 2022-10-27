import { Dialog } from '../dialog'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { ButtonGroup } from '../button-group'
import type { Wallet } from '../../contexts/global/global-context'

type DisconnectDialogProps = {
  isOpen: boolean
  wallet: Wallet
  hostname: string
  onClose: () => void
}

export const DisconnectDialog = ({ isOpen, wallet, hostname, onClose }: DisconnectDialogProps) => {
  // TODO: add service.WalletClient.DisconnectWallet({...}) when made available
  const handleDisconnect = () => {}

  return (
    <Dialog
      open={isOpen}
      title="Disconnect site"
      onChange={onClose}
    >
      <div style={{ padding: 20 }}>
        <p>Are you sure you want to disconnect your wallet <pre>{wallet.name}</pre> from <pre>{hostname}</pre>? You may lose site functionality.</p>
      </div>
      <ButtonGroup inline style={{ padding: 20 }}>
        <Button onClick={handleDisconnect}>
          Disconnect
        </Button>
        <ButtonUnstyled onClick={onClose}>
          Cancel
        </ButtonUnstyled>
      </ButtonGroup>
    </Dialog>
  )
}
