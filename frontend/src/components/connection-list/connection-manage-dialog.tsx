import { Intent } from '../../config/intent'
import type { Wallet } from '../../contexts/global/global-context'
import { useGlobal } from '../../contexts/global/global-context'
import { Button } from '../button'
import { ButtonGroup } from '../button-group'
import { ButtonUnstyled } from '../button-unstyled'
import { Dialog } from '../dialog'
import { requestPassphrase } from '../passphrase-modal'
import { AppToaster } from '../toaster'

type ManageDialogProps = {
  isOpen: boolean
  wallet: Wallet
  hostname: string
  onClose: () => void
}

export const ManageDialog = ({
  isOpen,
  wallet,
  hostname,
  onClose
}: ManageDialogProps) => {
  const { service } = useGlobal()

  const handleUpdate = async () => {
    try {
      const passphrase = await requestPassphrase()

      const r = await service.WalletApi.UpdatePermissions({
        wallet: wallet.name,
        passphrase,
        hostname,
        permissions: {
          publicKeys: {
            access: 'read',
            restrictedKeys: []
          }
        }
      })

      console.log('UPDATED PERM', r)
    } catch (err) {
      if (err !== 'dismissed') {
        AppToaster.show({
          message: `${err}`,
          intent: Intent.DANGER
        })
      }
    }
  }

  return (
    <Dialog open={isOpen} title='Update permissions' onChange={onClose}>
      <div style={{ padding: 20 }}>
        <p>
          <code>{hostname}</code> has access to the following operations in the
          wallet <code>{wallet.name}</code>:
        </p>
      </div>
      <ButtonGroup inline style={{ padding: 20 }}>
        <Button onClick={handleUpdate}>Update</Button>
        <ButtonUnstyled onClick={onClose}>Cancel</ButtonUnstyled>
      </ButtonGroup>
    </Dialog>
  )
}
