import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Dialog } from '../dialog'
import { Warning } from '../icons/warning'

const WarningPrompt = ({ wallets }: { wallets: string[] }) => {
  if (wallets.length > 1) {
    return (
      <p>
        You have active connections in the following wallets:{' '}
        <code>{wallets.join(', ')}</code>.
      </p>
    )
  }
  return (
    <p>
      You have active connections in your <code>{wallets[0]}</code> wallet.
    </p>
  )
}

type NetworkSwitchDialogProps = {
  activeConnections: string[]
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  onConfirm: () => void
}

export const ConnectionsWarningDialog = ({
  activeConnections,
  isOpen,
  setOpen,
  onConfirm
}: NetworkSwitchDialogProps) => {
  return (
    <Dialog
      open={isOpen && activeConnections.length > 0}
      title={
        <>
          <Warning style={{ width: 20, marginRight: 12 }} />
          Warning
        </>
      }
      onChange={setOpen}
    >
      <div style={{ padding: 20 }}>
        <WarningPrompt wallets={activeConnections} />
        <p>
          Switching networks will result in losing these connections, and having
          to reconnect the dApps to your wallets.
        </p>
      </div>
      <ButtonGroup inline style={{ padding: 20 }}>
        <Button onClick={onConfirm}>Switch</Button>
        <ButtonUnstyled onClick={() => setOpen(false)}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </Dialog>
  )
}
